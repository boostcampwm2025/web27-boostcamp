import type { CampaignWithTags, Tag } from '../types/campaign.types';

export abstract class CampaignRepository {
  abstract getAll(): Promise<CampaignWithTags[]>;
  abstract getById(campaignId: string): Promise<CampaignWithTags | null>;
  abstract getByTags(tags: Tag[]): Promise<CampaignWithTags[]>;
  abstract listByUserId(userId: number): Promise<CampaignWithTags[]>;
}
