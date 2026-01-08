import { BidLog } from '../types/bid-log.types';

export abstract class BidLogRepository {
  abstract save(bidLog: BidLog): void;
  abstract saveMany(bidLogs: BidLog[]): void;
  abstract findByAuctionId(auctionId: string): BidLog[];
  abstract findByCampaignId(campaignId: string): BidLog[];
  abstract count(): number;
  abstract getAll(): BidLog[];
}
