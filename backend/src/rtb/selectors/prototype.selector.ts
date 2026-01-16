import { Injectable } from '@nestjs/common';
import { CampaignSelector } from './selector.interface';
import type { ScoredCandidate, SelectionResult } from '../types/decision.types';

@Injectable()
export class PrototypeCampaignSelector implements CampaignSelector {
  async selectWinner(candidates: ScoredCandidate[]): Promise<SelectionResult> {
    // 점수 내림차순 정렬 (동점자 비교)
    const sorted = [...candidates].sort((a, b) => {
      // 1차: 점수 비교
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // 2차: 동점이면 max_cpc 비교
      return b.max_cpc - a.max_cpc;
    });

    // 1등 = winner, 나머지 = candidates
    return Promise.resolve({
      winner: sorted[0],
      candidates: sorted,
    });
  }
}
