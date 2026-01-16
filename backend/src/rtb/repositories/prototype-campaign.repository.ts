import { Injectable } from '@nestjs/common';
import type { CampaignRepository } from './campaign.repository.interface';
import type { Campaign, Tag } from '../types/decision.types';

import { CAMPAIGNS_MOCK } from '../../data/campaign.mock';

@Injectable()
export class PrototypeCampaignRepository implements CampaignRepository {
  private campaigns: Campaign[] = CAMPAIGNS_MOCK;

  findByTags(tags: Tag[]): Promise<Campaign[]> {
    const tagNames = tags.map((tag) => tag.name);
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        campaign.tags.some((tag) => tagNames.includes(tag.name))
      )
    );
  }

  findById(id: string): Promise<Campaign | null> {
    return Promise.resolve(this.campaigns.find((c) => c.id === id) || null);
  }

  findAll(): Promise<Campaign[]> {
    return Promise.resolve(this.campaigns);
  }
}
