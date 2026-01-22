export type CampaignStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export type Campaign = {
  id: string;
  userId: number;
  title: string;
  content: string;
  image: string;
  url: string;
  maxCpc: number;
  dailyBudget: number;
  totalBudget: number | null;
  dailySpent: number;
  totalSpent: number;
  lastResetDate: Date;
  isHighIntent: boolean;
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  deletedAt: Date | null;
};

export type Tag = {
  id: number;
  name: string;
};

export type CampaignWithTags = Campaign & {
  tags: Tag[];
};

export type CampaignWithStats = CampaignWithTags & {
  impressions: number;
  clicks: number;
  ctr: number;
  dailySpentPercent: number;
  totalSpentPercent: number;
};

export type CampaignTag = {
  campaignId: string;
  tagId: number;
};
