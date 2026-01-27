import type { CreditHistory } from '../lib/types';
import { formatWithComma } from '@shared/lib/format/formatCurrency';

interface CreditHistoryTableRowProps {
  history: CreditHistory;
}

export function CreditHistoryTableRow({ history }: CreditHistoryTableRowProps) {
  const isCharge = history.type === 'CHARGE';
  const amountColor = isCharge ? 'text-blue-600' : 'text-red-600';
  const amountPrefix = isCharge ? '+' : '-';

  const getDescription = () => {
    if (isCharge) {
      // campaignName이 "신규 가입 축하 크레딧"이면 그대로 표시
      if (history.campaignName === '신규 가입 축하 크레딧') {
        return history.campaignName;
      }
      return '충전';
    }
    return history.campaignName ? `${history.campaignName} 캠페인 생성` : '캠페인 생성';
  };

  return (
    <tr className="text-sm border-b border-gray-100">
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {new Date(history.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </td>
      <td className="px-5 py-4 text-gray-900">{getDescription()}</td>
      <td className={`px-5 py-4 text-right font-semibold whitespace-nowrap ${amountColor}`}>
        {amountPrefix}
        {formatWithComma(history.amount)}원
      </td>
      <td className="px-5 py-4 text-right text-gray-900 whitespace-nowrap">
        {formatWithComma(history.balanceAfter)}원
      </td>
    </tr>
  );
}
