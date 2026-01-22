export type CampaignStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export interface CampaignStats {
  id: string;
  title: string;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  ctr: number;
  dailySpentPercent: number;
  totalSpentPercent: number;
  isHighIntent: boolean;
}

export interface CampaignStatsResponse {
  campaigns: CampaignStats[];
  total: number;
  hasMore: boolean;
}
