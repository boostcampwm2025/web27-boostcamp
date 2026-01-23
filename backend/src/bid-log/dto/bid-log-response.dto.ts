export interface BidLogItemDto {
  id: number;
  createdAt: Date;
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
}

export interface BidLogDataDto {
  total: number;
  hasMore: boolean;
  bids: BidLogItemDto[];
}

export interface BidLogResponseDto {
  status: string;
  message: string;
  data: BidLogDataDto;
  timestamp: string;
}
