import { Injectable } from '@nestjs/common';
import { BidLogRepository } from './bid-log.repository';
import { BidLog } from '../types/bid-log.types';

@Injectable()
export class InMemoryBidLogRepository extends BidLogRepository {
  private bidLogs: BidLog[] = [];

  save(bidLog: BidLog): void {
    this.bidLogs.push(bidLog);
  }

  saveMany(bidLogs: BidLog[]): void {
    this.bidLogs.push(...bidLogs);
  }

  findByAuctionId(auctionId: string): BidLog[] {
    return this.bidLogs.filter((log) => log.auctionId === auctionId);
  }

  findByCampaignId(campaignId: string): BidLog[] {
    return this.bidLogs.filter((log) => log.campaignId === campaignId);
  }

  count(): number {
    return this.bidLogs.length;
  }

  getAll(): BidLog[] {
    return [...this.bidLogs];
  }
}
