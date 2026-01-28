import { Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matchers/matcher.interface';
import { Scorer } from './scorers/scorer.interface';
import { CampaignSelector } from './selectors/selector.interface';
import type {
  DecisionContext,
  Candidate,
  ScoredCandidate,
} from './types/decision.types';
import { randomUUID } from 'crypto';
import { BidLogRepository } from '../bid-log/repositories/bid-log.repository.interface';
import { BidLogService } from '../bid-log/bid-log.service';
import { CacheRepository } from '../cache/repository/cache.repository.interface';
import { BidLog, BidStatus } from '../bid-log/bid-log.types';
import { BlogRepository } from '../blog/repository/blog.repository.interface';
import { CampaignRepository } from '../campaign/repository/campaign.repository.interface';

@Injectable()
export class RTBService {
  private readonly logger = new Logger(RTBService.name);
  private readonly FALLBACK_CAMPAIGN_ID =
    'c1dda7a5-da58-416b-b8fa-20ba8f5535f9';

  constructor(
    private readonly matcher: Matcher,
    private readonly scorer: Scorer,
    private readonly selector: CampaignSelector,
    private readonly bidLogRepository: BidLogRepository,
    private readonly bidLogService: BidLogService,
    private readonly cacheRepository: CacheRepository,
    private readonly blogRepository: BlogRepository,
    private readonly campaignRepository: CampaignRepository
  ) {}

  // cache 문제로 인한 무의미한 주석
  // 경매 참여 가능한 캠페인만 필터링
  private filterEligibleCampaigns(candidates: Candidate[]): Candidate[] {
    const now = new Date();

    return candidates.filter((candidate) => {
      const campaign = candidate.campaign;

      // 삭제된 캠페인 제외
      if (campaign.deletedAt) {
        return false;
      }

      // ACTIVE 상태만 허용
      if (campaign.status !== 'ACTIVE') {
        return false;
      }

      // 날짜 범위 검증
      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);

      if (now < startDate || now >= endDate) {
        return false;
      }

      return true;
    });
  }

  async runAuction(context: DecisionContext) {
    try {
      const auctionId = randomUUID();

      // 0. blogKey → Blog 조회 (Guard에서 이미 검증됨)
      const blog = await this.blogRepository.findByBlogKey(context.blogKey);
      if (!blog) {
        throw new Error(`블로그를 찾을 수 없습니다: ${context.blogKey}`);
      }
      const blogId = blog.id;

      // 1. 후보 필터링
      let candidates: Candidate[] =
        await this.matcher.findCandidatesByTags(context);

      // 2. 고의도 필터링 (isHighIntent에 따라 광고 분리)
      if (context.isHighIntent) {
        // 고의도 요청: is_high_intent=true 광고만
        candidates = candidates.filter((c) => c.campaign.isHighIntent === true);
      } else {
        // 일반 요청: is_high_intent=false 광고만
        candidates = candidates.filter(
          (c) => c.campaign.isHighIntent === false
        );
      }

      // 3. 캠페인 상태 검증 (ACTIVE + 날짜 범위 + 삭제되지 않음)
      // todo: active 캠페인들을 redis에 들고있기?
      candidates = this.filterEligibleCampaigns(candidates);

      // 후보가 없으면 fallback 캠페인 조회
      if (candidates.length === 0) {
        this.logger.warn(
          `후보가 없습니다. Fallback 캠페인 조회: ${this.FALLBACK_CAMPAIGN_ID}`
        );

        const fallbackCampaign = await this.campaignRepository.getById(
          this.FALLBACK_CAMPAIGN_ID
        );

        if (fallbackCampaign) {
          candidates = [
            {
              campaign: fallbackCampaign,
              similarity: 0,
            },
          ];
        } else {
          throw new Error('Fallback 캠페인을 찾을 수 없습니다');
        }
      }

      // 2. 점수 계산 (아 복잡하다)
      const scored: ScoredCandidate[] =
        await this.scorer.scoreCandidates(candidates);

      // 3. 우승자 선정
      const result = await this.selector.selectWinner(scored);

      // 4. AuctionStore에 경매 데이터 저장 (ViewLog에서 조회용)
      await this.cacheRepository.setAuctionData(auctionId, {
        blogId: blogId,
        cost: result.winner.maxCpc,
      });

      // 5. BidLog 저장 (모든 참여 캠페인의 입찰 기록)
      const bidLogs: BidLog[] = result.candidates.map((candidate) => ({
        auctionId,
        campaignId: candidate.id,
        blogId: blogId,
        status:
          candidate.id === result.winner.id ? BidStatus.WIN : BidStatus.LOSS,
        bidPrice: candidate.maxCpc,
        isHighIntent: context.isHighIntent,
        behaviorScore: context.behaviorScore,
        postUrl: context.postUrl,
        reason: '', // 추후에 수정 필요
      }));
      await this.bidLogRepository.saveMany(bidLogs);

      this.logger.log(
        `Auction ${auctionId}: ${bidLogs.length}개 BidLog 저장 완료 (WIN: ${result.winner.id})`
      );

      // SSE: 입찰 이벤트 발행 (모든 BidLog에 대해)
      const savedBids = await this.bidLogRepository.findByAuctionId(auctionId);

      for (const savedBid of savedBids) {
        if (savedBid.id) {
          await this.bidLogService.emitBidCreated(savedBid.id);
        }
      }

      // 6. explain(reason) 생성 추후 로깅용 -> 일단 보류
      // return {
      //   winner: {
      //     ...result.winner,
      //     explain: this.generateExplain(result.winner, context),
      //   },
      //   candidates: result.candidates.map((c) => ({
      //     ...c,
      //     explain: this.generateExplain(c, context),
      //   })),
      // };

      return {
        status: 'success',
        message: '광고 선정 완료',
        data: {
          auctionId,
          campaign: { ...result.winner },
          candidates: result.candidates,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      this.logger.warn(`Auction 실패: ${errorMessage}`);

      // 에러 발생 시(예: 후보 없음) null winner와 빈 리스트를 반환하여 정상 응답 처리

      // message와 error 필드에 대해서는 추후에 통일된 에러 헨들링 전략 사용이 용이할 거 같음
      return {
        status: 'error',
        message: 'error message',
        data: null,
        errors: [
          {
            field: 'field',
            message: 'error message',
          },
        ],
        timestamp: new Date().toISOString(),
      };
    }
  }
}
