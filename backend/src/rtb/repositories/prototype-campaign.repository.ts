import { Injectable } from '@nestjs/common';
import type { CampaignWithTags, Tag } from 'src/campaign/types/campaign.types';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository';

import { CAMPAIGNS_MOCK } from '../../data/campaign.mock';

@Injectable()
export class PrototypeCampaignRepository extends CampaignRepository {
  private campaigns: CampaignWithTags[] = CAMPAIGNS_MOCK;

  constructor() {
    super();
  }

  getByTags(tags: Tag[]): Promise<CampaignWithTags[]> {
    const tagNames = tags.map((tag) => tag.name);
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        campaign.tags.some((tag) => tagNames.includes(tag.name))
      )
    );
  }

  getById(id: string): Promise<CampaignWithTags | null> {
    return Promise.resolve(this.campaigns.find((c) => c.id === id) || null);
  }

  getAll(): Promise<CampaignWithTags[]> {
    return Promise.resolve(this.campaigns);
  }

  listByUserId(userId: number): Promise<CampaignWithTags[]> {
    return Promise.resolve(this.campaigns.filter((c) => c.userId === userId));
  }
}
