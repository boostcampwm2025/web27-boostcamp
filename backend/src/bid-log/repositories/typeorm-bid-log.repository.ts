import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BidLogRepository } from './bid-log.repository.interface';
import { BidLogEntity } from '../entities/bid-log.entity';
import { BidLog, BidStatus } from '../bid-log.types';

@Injectable()
export class TypeOrmBidLogRepository extends BidLogRepository {
  constructor(
    @InjectRepository(BidLogEntity)
    private readonly repository: Repository<BidLogEntity>
  ) {
    super();
  }

  async save(bidLog: BidLog): Promise<void> {
    await this.repository.save(bidLog);
  }

  async saveMany(bidLogs: BidLog[]): Promise<void> {
    await this.repository.save(bidLogs);
  }

  async findByAuctionId(auctionId: string): Promise<BidLog[]> {
    const logs = await this.repository.find({
      where: { auctionId },
    });
    return logs;
  }

  async findByCampaignId(campaignId: string): Promise<BidLog[]> {
    const logs = await this.repository.find({
      where: { campaignId },
    });
    return logs;
  }

  async findWinAmountByAuctionId(auctionId: string): Promise<number | null> {
    const winLog = await this.repository.findOne({
      where: { auctionId, status: BidStatus.WIN },
    });
    return winLog ? winLog.bidPrice : null;
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async getAll(): Promise<BidLog[]> {
    const logs = await this.repository.find();
    return logs;
  }
}
