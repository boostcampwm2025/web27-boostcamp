import { Injectable } from '@nestjs/common';
import { Scorer } from './scorer.interface';
import type {
  Campaign,
  DecisionContext,
  ScoringResult,
} from '../types/decision.types';

@Injectable()
export class PrototypeScorer implements Scorer {
  score(campaign: Campaign, context: DecisionContext): Promise<ScoringResult> {
    // CPC 기본 점수 (max_price 사용)
    const cpc = campaign.max_price;

    // 태그 매칭 보너스 (일치 개수 ^ 5)
    const matchedTags = campaign.tags.filter((tag) =>
      context.tags.includes(tag.name)
    );
    const matchCount = matchedTags.length ** 3;

    // 기타 보너스 (MVP에선 0)
    const otherBonus = 0;

    return Promise.resolve({
      score: cpc * matchCount + otherBonus,
      breakdown: {
        cpc,
        matchCount,
        otherBonus,
      },
    });
  }
}
