import { Injectable } from '@nestjs/common';
import { CampaignSelector } from './selector.interface';
import type { ScoredCandidate, SelectionResult } from '../types/decision.types';

@Injectable()
export class PrototypeCampaignSelector implements CampaignSelector {
  async selectWinner(candidates: ScoredCandidate[]): Promise<SelectionResult> {
    if (candidates.length === 0) {
      throw new Error('No candidates available for selection');
    }

    // 점수 내림차순 정렬
    const sorted = [...candidates].sort((a, b) => b.score - a.score);

    // 1등 = winner, 나머지 = candidates
    return Promise.resolve({
      winner: sorted[0],
      candidates: sorted,
    });
  }
}
