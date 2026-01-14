import { Campaign } from '../types/campaign.types';

export abstract class CampaignRepository {
  abstract listByUserId(userId: number): Promise<Campaign[]>;
  abstract getById(campaignId: string): Promise<Campaign | undefined>;
}
