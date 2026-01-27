import { CreditHistoryEntity } from '../entities/credit-history.entity';

export interface CreditHistoryWithCampaignName {
  id: number;
  type: 'CHARGE' | 'WITHDRAW';
  amount: number;
  balanceAfter: number;
  campaignName: string | null;
  description: string | null;
  createdAt: Date;
}

export abstract class CreditHistoryRepository {
  abstract save(
    creditHistory: Partial<CreditHistoryEntity>
  ): Promise<CreditHistoryEntity>;
  abstract findByUserId(
    userId: number,
    limit: number,
    offset: number
  ): Promise<CreditHistoryWithCampaignName[]>;
  abstract countByUserId(userId: number): Promise<number>;
}
