import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from './repository/user.repository.interface';
import { CreditHistoryRepository } from './repository/credit-history.repository.interface';
import {
  CreditHistoryType,
  CreditHistoryEntity,
} from './entities/credit-history.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly creditHistoryRepository: CreditHistoryRepository,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  async handleFirstLogin(userId: number): Promise<boolean> {
    const isFirstLogin =
      await this.userRepository.setFirstLoginAtIfNull(userId);
    return isFirstLogin;
  }

  async getBalance(userId: number): Promise<number> {
    const balance = await this.userRepository.getBalanceById(userId);
    if (balance === null) {
      throw new Error('사용자를 찾을 수 없습니다');
    }
    return balance;
  }

  async chargeCredit(
    userId: number,
    amount: number
  ): Promise<{ balanceAfter: number; historyId: number }> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. 사용자 조회 및 잠금
      const userRepo = manager.getRepository(UserEntity);
      const user = await userRepo.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
      }

      // 2. 잔액 업데이트
      const newBalance = user.balance + amount;
      user.balance = newBalance;
      await userRepo.save(user);

      // 3. 히스토리 기록
      const historyRepo = manager.getRepository(CreditHistoryEntity);
      const history = await historyRepo.save({
        userId,
        type: CreditHistoryType.CHARGE,
        amount,
        balanceAfter: newBalance,
        campaignId: null,
      });

      return {
        balanceAfter: newBalance,
        historyId: history.id,
      };
    });
  }

  async getCreditHistory(
    userId: number,
    limit: number,
    offset: number
  ): Promise<{
    histories: Array<{
      id: number;
      type: 'CHARGE' | 'WITHDRAW';
      amount: number;
      balanceAfter: number;
      campaignName: string | null;
      createdAt: Date;
    }>;
    total: number;
    hasMore: boolean;
  }> {
    const [histories, total] = await Promise.all([
      this.creditHistoryRepository.findByUserId(userId, limit, offset),
      this.creditHistoryRepository.countByUserId(userId),
    ]);

    const hasMore = offset + limit < total;

    return {
      histories,
      total,
      hasMore,
    };
  }
}
