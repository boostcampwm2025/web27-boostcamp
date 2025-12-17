import { Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matchers/matcher.interface';
import { Scorer } from './scorers/scorer.interface';
import { CampaignSelector } from './selectors/selector.interface';
import type {
  DecisionContext,
  ScoredCandidate,
  ScoringResult,
  Campaign,
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
    const scored = await this.scoreCandidates(candidates, context);

    // 3. 우승자 선정
    const result = await this.selector.selectWinner(scored);

    // 4. explain 추가
    return {
      winner: {
        ...result.winner,
        explain: this.generateExplain(result.winner, context),
      },
      candidates: result.candidates.map((c) => ({
        ...c,
        explain: this.generateExplain(c, context),
      })),
    };
  }

  private async scoreCandidates(
    candidates: Campaign[],
    context: DecisionContext
  ): Promise<ScoredCandidate[]> {
    return Promise.all(
      candidates.map(async (campaign) => {
        const { score, breakdown }: ScoringResult = await this.scorer.score(
          campaign,
          context
        );

        this.logger.debug(
          `Campaign ${campaign.id}: CPC=${breakdown.cpc}, Match=${breakdown.matchCount}, Score=${score}`
        );

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
  }

  private generateExplain(
    candidate: ScoredCandidate,
    context: DecisionContext
  ): string {
    const matchedTagNames = candidate.matchedTags.map((t) => t.name).join(', ');
    const matchCount = candidate.matchedTags.length;

    return (
      `[${matchedTagNames}] ${matchCount} / ${context.tags.length} 일치 ` +
      `[CPC]: ${candidate.max_price}원, ` +
      `[SCORE]: ${candidate.score}점으로 선정`
    );
  }
}
