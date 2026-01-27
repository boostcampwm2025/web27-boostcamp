import type { BidLog } from '../lib/types';
import { Icon } from '@shared/ui/Icon';

interface RealtimeBidsTableRowProps {
  bid: BidLog;
}

export function RealtimeBidsTableRow({ bid }: RealtimeBidsTableRowProps) {
  // 날짜/시간 포맷팅 (YYYY.MM.DD HH:mm)
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  // 금액 천 단위 콤마
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  // URL에서 도메인명만 추출
  const extractDomain = (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      const urlObj = new URL(fullUrl);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <tr
      className={`text-sm border-b border-gray-100 ${bid.isWon ? 'bg-green-100/30' : ''}`}
    >
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {formatDateTime(bid.createdAt)}
      </td>
      <td className="px-5 py-4 text-gray-900 font-semibold max-w-[200px]">
        <div className="line-clamp-2">{bid.campaignTitle}</div>
      </td>
      <td className="px-5 py-4">
        {bid.postUrl ? (
          <a
            href={
              bid.postUrl.startsWith('http')
                ? bid.postUrl
                : `https://${bid.postUrl}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs"
            title={bid.postUrl}
          >
            {extractDomain(bid.postUrl)}
          </a>
        ) : (
          <span className="text-gray-500 text-xs">{bid.blogName}</span>
        )}
      </td>
      <td
        className={`px-5 py-4 whitespace-nowrap ${bid.isWon ? 'text-green-500' : 'text-gray-600'}`}
      >
        {formatAmount(bid.bidAmount)}
      </td>
      <td
        className={`px-5 py-4 font-semibold whitespace-nowrap ${bid.isWon ? 'text-green-500' : 'text-gray-900'}`}
      >
        {bid.winAmount !== null ? formatAmount(bid.winAmount) : '-'}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div className="text-gray-900 text-sm">
          {bid.isHighIntent
            ? `고의도 학습자 - ${bid.behaviorScore}점 학습자`
            : '모든 학습자'}
        </div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
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
