export type CreditHistoryType = 'CHARGE' | 'WITHDRAW';

export interface CreditHistory {
  id: number;
  type: CreditHistoryType;
  amount: number;
  balanceAfter: number;
  campaignName?: string;
  description?: string;
  createdAt: string;
}

export interface CreditHistoryResponse {
  histories: CreditHistory[];
  total: number;
  hasMore: boolean;
}
