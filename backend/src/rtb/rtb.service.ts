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

@Injectable()
export class RTBService {
  private readonly logger = new Logger(RTBService.name);

  constructor(
    private readonly matcher: Matcher,
    private readonly scorer: Scorer,
    private readonly selector: CampaignSelector
  ) {}

  async runAuction(context: DecisionContext) {
    try {
      const auctionId = randomUUID();

      // 1. 후보 필터링
      const candidates: Candidate[] =
        await this.matcher.findCandidatesByTags(context);

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

      // 4. explain(reason) 생성 추후 로깅용 -> 일단 보류
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
