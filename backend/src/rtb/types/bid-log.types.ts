export interface BidLog {
  auctionId: string; // 경매 고유 ID (UUID)
  campaignId: string; // 캠페인 ID
  blogId: string; // 블로그 ID (blogKey)
  status: 'WIN' | 'LOSS'; // 낙찰/탈락
  bidPrice: number; // 입찰가 (max_price)
  timestamp: string; // ISO 타임스탬프
}
