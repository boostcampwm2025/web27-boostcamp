import { Injectable } from '@nestjs/common';
import { BidLogRepository } from './bid-log.repository';
import { BidLog } from '../bid-log.types';

@Injectable()
export class InMemoryBidLogRepository extends BidLogRepository {
  private bidLogs: BidLog[] = [];
  private currentId = 0;

  save(bidLog: BidLog): void {
    this.currentId += 1;
    this.bidLogs.push({ ...bidLog, id: this.currentId });
  }

  saveMany(bidLogs: BidLog[]): void {
    const logsWithIds = bidLogs.map((log) => {
      this.currentId += 1;
      return { ...log, id: this.currentId };
    });
    this.bidLogs.push(...logsWithIds);
  }

  findByAuctionId(auctionId: string): BidLog[] {
    return this.bidLogs.filter((log) => log.auctionId === auctionId);
  }

  findByCampaignId(campaignId: string): BidLog[] {
    return this.bidLogs.filter((log) => log.campaignId === campaignId);
  }

  findWinAmountByAuctionId(auctionId: string): number | null {
    const winLog = this.bidLogs.find(
      (log) => log.auctionId === auctionId && log.status === 'WIN'
    );
    return winLog ? winLog.bidPrice : null;
  }

  count(): number {
    return this.bidLogs.length;
  }

  getAll(): BidLog[] {
    return [...this.bidLogs];
  }
}
