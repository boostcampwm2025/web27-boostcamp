import { Injectable } from '@nestjs/common';
import type { CampaignRepository } from './campaign.repository.interface';
import type { CampaignWithTags, Tag } from 'src/campaign/types/campaign.types';

import { CAMPAIGNS_MOCK } from '../../data/campaign.mock';

@Injectable()
export class PrototypeCampaignRepository implements CampaignRepository {
  private campaigns: CampaignWithTags[] = CAMPAIGNS_MOCK;

  findByTags(tags: Tag[]): Promise<CampaignWithTags[]> {
    const tagNames = tags.map((tag) => tag.name);
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        campaign.tags.some((tag) => tagNames.includes(tag.name))
      )
    );
  }

  findById(id: string): Promise<CampaignWithTags | null> {
    return Promise.resolve(this.campaigns.find((c) => c.id === id) || null);
  }

  findAll(): Promise<CampaignWithTags[]> {
    return Promise.resolve(this.campaigns);
  }
}
