import { Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matchers/matcher.interface';
import { Scorer } from './scorers/scorer.interface';
import { CampaignSelector } from './selectors/selector.interface';
import type {
  DecisionContext,
  ScoredCandidate,
  ScoringResult,
} from './types/decision.types';

@Injectable()
export class RTBService {
  private readonly logger = new Logger(RTBService.name);

  constructor(
    private readonly matcher: Matcher,
    private readonly scorer: Scorer,
    private readonly selector: CampaignSelector
  ) {}

  async runAuction(context: DecisionContext) {
    // 1. 후보 필터링
    const candidates = await this.matcher.findCandidatesByTags(context);

    // 2. 점수 계산 (아 복잡하다)
    const scored: ScoredCandidate[] = await Promise.all(
      candidates.map(async (campaign) => {
        const { score, breakdown }: ScoringResult = await this.scorer.score(
          campaign,
          context
        );

        this.logger.log(`${breakdown.cpc} 등등 쓰일 예정`);

        const matchedTags = campaign.tags.filter((tag) =>
          context.tags.includes(tag.name)
        );

        return {
          ...campaign,
          score,
          matchedTags,
        };
      })
    );

    // 3. 우승자 선정
    const result = await this.selector.selectWinner(scored);

    return result;
  }
}
