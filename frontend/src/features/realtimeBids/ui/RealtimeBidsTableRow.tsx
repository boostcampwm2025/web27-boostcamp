import type { BidLog } from '../lib/types';
import { Icon } from '@/shared/ui/Icon';

interface RealtimeBidsTableRowProps {
  bid: BidLog;
}

export function RealtimeBidsTableRow({ bid }: RealtimeBidsTableRowProps) {
  // 시간 포맷팅 (HH:mm)
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 금액 천 단위 콤마
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  return (
    <tr
      className={`text-base border-b border-gray-100 ${bid.isWon ? 'bg-green-100/30' : ''}`}
    >
      <td className="px-5 py-4 text-gray-600">{formatTime(bid.timestamp)}</td>
      <td className="px-5 py-4 text-gray-900 font-semibold">
        {bid.campaignTitle}
      </td>
      <td className="px-5 py-4 text-gray-900">{bid.blogName}</td>
      <td
        className={`px-5 py-4 ${bid.isWon ? 'text-green-500' : 'text-gray-600'}`}
      >
        {formatAmount(bid.bidAmount)}
      </td>
      <td
        className={`px-5 py-4 font-semibold ${bid.isWon ? 'text-green-500' : 'text-gray-900'}`}
      >
        {formatAmount(bid.winAmount)}
      </td>
      <td className="px-5 py-4">
        <div className="text-gray-600 text-sm">
          {bid.isHighIntent
            ? `고의도 학습자 대상 - ${bid.behaviorScore}점 학습자`
            : '모든 학습자 대상'}
        </div>
      </td>
      <td className="px-5 py-4">
        {bid.isWon ? (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-green-100 border border-green-300 rounded-lg text-xs font-semibold text-green-500 w-fit">
            <Icon.Circle className="w-3 h-3 text-green-500" />
            낙찰
          </div>
        ) : (
          <div className="flex flex-row items-center gap-1 px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-500 w-fit">
            <Icon.Circle className="w-3 h-3 text-gray-500" />
            탈락
          </div>
        )}
      </td>
    </tr>
  );
}
