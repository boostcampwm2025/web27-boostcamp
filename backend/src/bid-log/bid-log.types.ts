export interface BidLog {
  id?: number;
  auctionId: string;
  campaignId: string;
  blogId: string;
  status: 'WIN' | 'LOSS';
  bidPrice: number;
  isHighIntent: boolean;
  behaviorScore: number;
  timestamp: string;
}
