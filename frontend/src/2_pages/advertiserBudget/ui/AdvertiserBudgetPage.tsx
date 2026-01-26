import { CreditBalanceCard, ChargeAmountSelector } from '@features/creditBalance';
import { CreditHistoryTable } from '@features/creditHistory';

export function AdvertiserBudgetPage() {
  return (
    <div className="flex flex-col gap-4 px-8 py-8 bg-gray-100">
      {/* 크레딧 잔액 */}
      <CreditBalanceCard />

      {/* 충전 금액 선택 */}
      <ChargeAmountSelector />

      {/* 크레딧 사용 내역 */}
      <CreditHistoryTable />
    </div>
  );
}
