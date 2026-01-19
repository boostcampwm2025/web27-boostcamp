export enum BidStatus {
  WIN = 'WIN',
  LOSS = 'LOSS',
}

export interface BidLog {
  id?: number;
  auctionId: string;
  campaignId: string;
  blogId: number;
  status: BidStatus;
  bidPrice: number;
  reason: string | null;
  createdAt?: Date;
}
