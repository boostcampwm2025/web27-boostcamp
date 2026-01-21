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

export interface BidLogResponseDto {
  status: string;
  message: string;
  data: BidLogItemDto[];
  timestamp: string;
}
