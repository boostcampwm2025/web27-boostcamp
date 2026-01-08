export interface BidLogItemDto {
  id: number;
  timestamp: string;
  campaignId: string;
  campaignTitle: string;
  blogKey: string;
  blogName: string;
  blogDomain: string;
  bidAmount: number;
  winAmount: number | null;
  isWon: boolean;
  isHighIntent: boolean;
  behaviorScore: number;
}

export interface BidLogResponseDto {
  status: string;
  message: string;
  data: BidLogItemDto[];
  timestamp: string;
}
