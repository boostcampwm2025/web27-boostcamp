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

  findByUserId(
    _userId: number,
    _limit?: number,
    _offset?: number,
    _sortBy?: 'createdAt',
    _order?: 'asc' | 'desc'
  ): Promise<BidLog[]> {
    // !WARN: InMemory 구현체는 Campaign 데이터에 접근할 수 없어서 userId 필터링 불가
    // 테스트 환경에서 필요하다면 CampaignRepository를 주입받아 구현 필요
    console.log(_userId, _limit, _offset, _sortBy, _order);
    return Promise.resolve([]);
  }
}
