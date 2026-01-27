import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditHistoryEntity } from '../entities/credit-history.entity';
import {
  CreditHistoryRepository,
  CreditHistoryWithCampaignName,
} from './credit-history.repository.interface';

@Injectable()
export class TypeOrmCreditHistoryRepository extends CreditHistoryRepository {
  constructor(
    @InjectRepository(CreditHistoryEntity)
    private readonly creditHistoryRepo: Repository<CreditHistoryEntity>
  ) {
    super();
  }

  async save(
    creditHistory: Partial<CreditHistoryEntity>
  ): Promise<CreditHistoryEntity> {
    return await this.creditHistoryRepo.save(creditHistory);
  }

  async findByUserId(
    userId: number,
    limit: number,
    offset: number
  ): Promise<CreditHistoryWithCampaignName[]> {
    const histories = await this.creditHistoryRepo
      .createQueryBuilder('ch')
      .leftJoinAndSelect('ch.campaign', 'c')
      .where('ch.userId = :userId', { userId })
      .orderBy('ch.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return histories.map((history) => ({
      id: history.id,
      type: history.type,
      amount: history.amount,
      balanceAfter: history.balanceAfter,
      campaignName: history.campaign?.title || null,
      createdAt: history.createdAt,
    }));
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.creditHistoryRepo
      .createQueryBuilder('ch')
      .where('ch.userId = :userId', { userId })
      .getCount();
  }
}
