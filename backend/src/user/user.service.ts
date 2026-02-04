import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from './repository/user.repository.interface';
import { UserEntity, UserRole } from './entities/user.entity';
import {
  CreditHistoryType,
  CreditHistoryEntity,
} from '../advertiser/entities/credit-history.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}

  async handleFirstLogin(userId: number): Promise<boolean> {
    const isFirstLogin =
      await this.userRepository.setFirstLoginAtIfNull(userId);

    // 첫 로그인이고 ADVERTISER인 경우에만 가입 축하 크레딧 지급
    if (isFirstLogin) {
      const user = await this.userRepository.getById(userId);

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
      }

      // ADVERTISER만 가입 축하 크레딧 지급
      if (user.role === UserRole.ADVERTISER) {
        const WELCOME_CREDIT = 1; // TODO: 임시로 0원으로 변경 (원래 100,000원)

        await this.dataSource.transaction(async (manager) => {
          const userRepo = manager.getRepository(UserEntity);
          const userForUpdate = await userRepo.findOne({
            where: { id: userId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!userForUpdate) {
            throw new Error('사용자를 찾을 수 없습니다');
          }

          const newBalance = userForUpdate.balance + WELCOME_CREDIT;
          userForUpdate.balance = newBalance;
          await userRepo.save(userForUpdate);

          const historyRepo = manager.getRepository(CreditHistoryEntity);
          await historyRepo.save({
            userId,
            type: CreditHistoryType.CHARGE,
            amount: WELCOME_CREDIT,
            balanceAfter: newBalance,
            campaignId: null,
            description: '신규 가입 축하 크레딧',
          });
        });
      }
    }

    return isFirstLogin;
  }

  async getBalance(userId: number): Promise<number> {
    const balance = await this.userRepository.getBalanceById(userId);
    if (balance === null) {
      throw new Error('사용자를 찾을 수 없습니다');
    }
    return balance;
  }
}
