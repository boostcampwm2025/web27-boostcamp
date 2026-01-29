import {
  CreditBalanceCard,
  ChargeAmountSelector,
} from '@features/creditBalance';
import { CreditHistoryTable } from '@features/creditHistory';
import { useDocumentTitle } from '@shared/lib/hooks';

export function AdvertiserBudgetPage() {
  useDocumentTitle('예산 관리');
  return (
    <div className="min-h-screen flex flex-col gap-4 px-8 py-8 bg-gray-50">
      {/* 크레딧 잔액 */}
      <CreditBalanceCard />

      {/* 충전 금액 선택 */}
      <ChargeAmountSelector />

      {/* 크레딧 사용 내역 */}
      <CreditHistoryTable />
    </div>
  );
}
