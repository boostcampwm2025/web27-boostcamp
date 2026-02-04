import type { EarningsHistoryItem } from '../lib/types';
import { Icon } from '@shared/ui/Icon';

interface EarningsHistoryTableRowProps {
  item: EarningsHistoryItem;
}

export function EarningsHistoryTableRow({ item }: EarningsHistoryTableRowProps) {
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

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
    <tr className="text-sm border-b border-gray-100 hover:bg-gray-50">
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap w-40">
        {formatDateTime(item.clickedAt)}
      </td>
      <td className="px-5 py-4 text-gray-900 font-semibold max-w-50">
        <div className="line-clamp-2">{item.campaignTitle}</div>
      </td>
      <td className="px-5 py-4">
        <a
          href={
            item.postUrl.startsWith('http')
              ? item.postUrl
              : `https://${item.postUrl}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-xs"
          title={item.postUrl}
        >
          {extractDomain(item.postUrl)}
        </a>
      </td>
      <td className="px-5 py-4 text-green-600 font-semibold whitespace-nowrap">
        +{formatAmount(item.revenue)}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        {item.isHighIntent ? (
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            <Icon.BadgeCheck className="w-3.5 h-3.5" />
            고의도
          </span>
        ) : (
          <span className="text-xs text-gray-500">일반 방문자</span>
        )}
      </td>
    </tr>
  );
}
