import { Injectable } from '@nestjs/common';
import { BidLogRepository } from './bid-log.repository.interface';
import { BidLog, BidStatus } from '../bid-log.types';

@Injectable()
export class InMemoryBidLogRepository extends BidLogRepository {
  private bidLogs: BidLog[] = [];
  private currentId = 0;

  save(bidLog: BidLog): Promise<void> {
    this.currentId += 1;
    this.bidLogs.push({ ...bidLog, id: this.currentId });
    return Promise.resolve();
  }

  saveMany(bidLogs: BidLog[]): Promise<void> {
    const logsWithIds = bidLogs.map((log) => {
      this.currentId += 1;
      return { ...log, id: this.currentId };
    });
    this.bidLogs.push(...logsWithIds);
    return Promise.resolve();
  }

  findByAuctionId(auctionId: string): Promise<BidLog[]> {
    return Promise.resolve(
      this.bidLogs.filter((log) => log.auctionId === auctionId)
    );
  }

  findByCampaignId(campaignId: string): Promise<BidLog[]> {
    return Promise.resolve(
      this.bidLogs.filter((log) => log.campaignId === campaignId)
    );
  }

  findWinAmountByAuctionId(auctionId: string): Promise<number | null> {
    const winLog = this.bidLogs.find(
      (log) => log.auctionId === auctionId && log.status === BidStatus.WIN
    );
    return Promise.resolve(winLog ? winLog.bidPrice : null);
  }

  count(): Promise<number> {
    return Promise.resolve(this.bidLogs.length);
  }

  getAll(): Promise<BidLog[]> {
    return Promise.resolve([...this.bidLogs]);
  }
}
