import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Matcher } from './matchers/matcher.interface';
import { Scorer } from './scorers/scorer.interface';
import { CampaignSelector } from './selectors/selector.interface';
import type {
  DecisionContext,
  Candidate,
  ScoredCandidate,
} from './types/decision.types';
import { randomUUID } from 'crypto';
import { BidLogRepository } from '../bid-log/repositories/bid-log.repository';
import { AuctionStore } from '../cache/auction/auction.store';
import { BidLog } from '../bid-log/bid-log.types';
import { getBlogIdByKey } from '../common/utils/blog.utils';

@Injectable()
export class RTBService {
  private readonly logger = new Logger(RTBService.name);

  constructor(
    private readonly matcher: Matcher,
    private readonly scorer: Scorer,
    private readonly selector: CampaignSelector,
    private readonly bidLogRepository: BidLogRepository,
    private readonly auctionStore: AuctionStore
  ) {}

  async runAuction(context: DecisionContext) {
    try {
      const auctionId = randomUUID();

      // 0. blogKey → blogId 변환
      const blogId = getBlogIdByKey(context.blogKey);
      if (blogId === null) {
        throw new NotFoundException(
          `블로그 키 '${context.blogKey}'에 해당하는 블로그를 찾을 수 없습니다.`
        );
      }

      // 1. 후보 필터링
      let candidates: Candidate[] =
        await this.matcher.findCandidatesByTags(context);

      // 2. 고의도 필터링 (isHighIntent에 따라 광고 분리)
      if (context.isHighIntent) {
        // 고의도 요청: is_high_intent=true 광고만
        candidates = candidates.filter(
          (c) => c.campaign.isHighIntent === true
        );
      } else {
        // 일반 요청: is_high_intent=false 광고만
        candidates = candidates.filter(
          (c) => c.campaign.isHighIntent === false
        );
      }

      if (candidates.length === 0) {
        throw new Error(
          `${context.tags.join(', ')}태그에 유사도가 비슷한 후보자들이 존재하지 않습니다.`
        );
      }

      // 2. 점수 계산 (아 복잡하다)
      const scored: ScoredCandidate[] =
        await this.scorer.scoreCandidates(candidates);

      // 3. 우승자 선정
      const result = await this.selector.selectWinner(scored);

      // 4. AuctionStore에 경매 데이터 저장 (ViewLog에서 조회용)
      this.auctionStore.set(auctionId, {
        blogId: blogId,
        cost: result.winner.maxCpc,
      });

      // 5. BidLog 저장 (모든 참여 캠페인의 입찰 기록)
      const timestamp = new Date().toISOString();
      const bidLogs: BidLog[] = result.candidates.map((candidate) => ({
        auctionId,
        campaignId: candidate.id,
        blogId: context.blogKey,
        status: candidate.id === result.winner.id ? 'WIN' : 'LOSS',
        bidPrice: candidate.maxCpc,
        isHighIntent: context.isHighIntent,
        behaviorScore: context.behaviorScore,
        timestamp,
      }));
      this.bidLogRepository.saveMany(bidLogs);

      this.logger.log(
        `Auction ${auctionId}: ${bidLogs.length}개 BidLog 저장 완료 (WIN: ${result.winner.id})`
      );

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
