export interface BidLog {
  id?: number;
  auctionId: string;
  campaignId: string;
  blogId: number;
  status: 'WIN' | 'LOSS';
  bidPrice: number;
  isHighIntent: boolean;
  behaviorScore: number | null;
  timestamp?: string;
  createdAt?: Date;
}
