import { BidLog } from '../bid-log.types';

export abstract class BidLogRepository {
  abstract save(bidLog: BidLog): Promise<void>;
  abstract saveMany(bidLogs: BidLog[]): Promise<void>;
  abstract findByAuctionId(auctionId: string): Promise<BidLog[]>;
  abstract findByCampaignId(campaignId: string): Promise<BidLog[]>;
  abstract findWinAmountByAuctionId(auctionId: string): Promise<number | null>;
  abstract count(): Promise<number>;
  abstract getAll(): Promise<BidLog[]>;
}
