export interface BidInsight {
  type: 'blog_info' | 'bid_suggestion';
  message: string;
}

export interface BidLog {
  id: number;
  auctionId: string;
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

export interface RealtimeBidsResponse {
  total: number;
  hasMore: boolean;
  bids: BidLog[];
}
