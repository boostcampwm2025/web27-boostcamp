import { BidLog } from '../bid-log.types';

export abstract class BidLogRepository {
  // 단일 입찰 로그 저장
  abstract save(bidLog: BidLog): Promise<void>;

  // 여러 입찰 로그들을 일괄 저장
  abstract saveMany(bidLogs: BidLog[]): Promise<void>;

  // 옥션 ID로 입찰 로그 조회
  abstract findByAuctionId(auctionId: string): Promise<BidLog[]>;

  // 캠페인 ID로 입찰 로그 조회
  abstract findByCampaignId(campaignId: string): Promise<BidLog[]>;

  // 특정 옥션의 낙찰가 조회
  abstract findWinAmountByAuctionId(auctionId: string): Promise<number | null>;

  // 전체 입찰 로그 수 조회
  abstract count(): Promise<number>;

  // 모든 입찰 로그 목록 조회
  abstract getAll(): Promise<BidLog[]>;
}
