export type CampaignStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';

export interface Tag {
  id: number;
  name: string;
}

export interface CampaignDetail {
  id: string;
  userId: number;
  title: string;
  content: string;
  image: string;
  url: string;
  tags: Tag[];
  maxCpc: number;
  dailyBudget: number;
  totalBudget: number | null;
  dailySpent: number;
  totalSpent: number;
  lastResetDate: string;
  isHighIntent: boolean;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  deletedAt: string | null;

  impressions: number;
  clicks: number;
  ctr: number;
  dailySpentPercent: number;
  totalSpentPercent: number;
}

export interface UpdateCampaignRequest {
  title?: string;
  content?: string;
  image?: string;
  url?: string;
  tags?: string[];
  isHighIntent?: boolean;
  maxCpc?: number;
  dailyBudget?: number;
  totalBudget?: number;
  status?: 'ACTIVE' | 'PAUSED';
  endDate?: string;
}

export interface UpdateBudgetRequest {
  totalBudget?: number;
  dailyBudget?: number;
  maxCpc?: number;
}

export interface SpendingLogItem {
  id: number;
  createdAt: string;
  postUrl: string;
  blogName: string;
  cpc: number;
  behaviorScore: number | null;
  isHighIntent: boolean;
}

export interface SpendingLogResponse {
  total: number;
  hasMore: boolean;
  logs: SpendingLogItem[];
}
