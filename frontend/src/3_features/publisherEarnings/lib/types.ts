export interface EarningsSummary {
  totalEarnings: number;
  todayEarnings: number;
}

export interface EarningsHistoryItem {
  clickedAt: string;
  campaignTitle: string;
  postUrl: string;
  revenue: number;
  isHighIntent: boolean;
}

export interface EarningsHistoryData {
  data: EarningsHistoryItem[];
  total: number;
  hasMore: boolean;
}
