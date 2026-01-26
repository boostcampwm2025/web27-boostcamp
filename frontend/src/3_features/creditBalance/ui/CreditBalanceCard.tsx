import { Icon } from '@shared/ui/Icon';
import { formatWithComma } from '@shared/lib/format/formatCurrency';

export function CreditBalanceCard() {
  // TODO: API 연동
  const balance = 50000;

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow">
      <div className="flex flex-row items-center justify-between text-gray-600">
        <span className="text-base font-semibold">크레딧 잔액</span>
        <Icon.Wallet className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex flex-row items-baseline gap-4 pt-4">
        <div className="text-4xl font-bold text-gray-900">
          {formatWithComma(balance)}
          <span className="text-2xl font-normal text-gray-600 ml-2">원</span>
        </div>
      </div>
    </div>
  );
}
