import { Campaign } from '../types/campaign.types';

export abstract class CampaignRepository {
  abstract listByUserId(userId: number): Campaign[];
  abstract getById(campaignId: string): Campaign | undefined;
}
