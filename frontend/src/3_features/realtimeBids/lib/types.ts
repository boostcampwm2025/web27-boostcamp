export interface BidInsight {
  type: 'blog_info' | 'bid_suggestion';
  message: string;
}

export interface BidLog {
  id: number;
  createdAt: string;
  campaignId: string;
  campaignTitle: string;
  blogKey: string;
  blogName: string;
  blogDomain: string;
  bidAmount: number;
  winAmount: number | null;
  isWon: boolean;
  isHighIntent: boolean;
  behaviorScore: number | null;
  insight?: BidInsight;
}

export interface RealtimeBidsData {
  total: number;
  hasMore: boolean;
  bids: BidLog[];
}

export interface RealtimeBidsResponse {
  status: string;
  message: string;
  data: RealtimeBidsData;
  timestamp: string;
}
