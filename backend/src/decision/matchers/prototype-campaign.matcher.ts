import { Injectable } from '@nestjs/common';
import { CampaignMatcher } from './campaign-matcher.interface';
import { CampaignRepository } from '../repositories/campaign.repository.interface';
import type { Campaign, DecisionContext, Tag } from '../types/decision.types';

@Injectable()
export class TagBasedMatcher implements CampaignMatcher {
  constructor(private readonly campaignRepo: CampaignRepository) {}

  async findCandidatesByTags(context: DecisionContext): Promise<Campaign[]> {
    const tags: Tag[] = context.tags.map((name, idx) => ({
      id: idx,
      name,
    }));

    // Repository에서 태그 기반 필터링
    const candidates = await this.campaignRepo.findByTags(tags);

    return candidates;
  }
}
