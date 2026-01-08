export interface BidInsight {
  type: 'blog_info' | 'bid_suggestion';
  message: string;
}

export interface BidLog {
  id: number;
  timestamp: string;
  campaignId: string;
  campaignTitle: string;
  blogKey: string;
  blogName: string;
  blogDomain: string;
  bidAmount: number;
  winAmount: number;
  isWon: boolean;
  isHighIntent: boolean;
  behaviorScore: number;
  insight?: BidInsight;
}

export type RealtimeBidsResponse = BidLog[];
