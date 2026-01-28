import { Icon } from '@shared/ui/Icon';
import { formatWithComma } from '@shared/lib/format';

export interface SpendingLogRowData {
  id: number;
  createdAt: string;
  postUrl: string;
  blogName: string;
  cpc: number;
  behaviorScore: number | null;
  isHighIntent: boolean;
}

interface SpendingLogTableRowProps {
  log: SpendingLogRowData;
}

function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function SpendingLogTableRow({ log }: SpendingLogTableRowProps) {
  return (
    <tr className="text-sm border-b border-gray-100 hover:bg-gray-50">
      {/* 시간 */}
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap">
        {formatDateTime(log.createdAt)}
      </td>

      {/* 포스트 / 블로그 */}
      <td className="min-w-48 max-w-64 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-900 font-medium truncate">
            {log.blogName}
          </span>
          <a
            href={log.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline truncate"
          >
            {log.postUrl}
          </a>
        </div>
      </td>

      {/* CPC */}
      <td className="px-5 py-4 text-gray-900 whitespace-nowrap font-medium">
        {formatWithComma(log.cpc)}원
      </td>

      {/* 방문자 유형 */}
      <td className="px-5 py-4 whitespace-nowrap">
        {log.isHighIntent ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
              {log.behaviorScore}점
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
              <Icon.BadgeCheck className="w-3.5 h-3.5" />
              고의도
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">일반 방문자</span>
        )}
      </td>

      {/* 상세 내역 */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs bg-gray-100">
          <span className="text-gray-700">클릭으로</span>
          <span className="text-red-700 font-bold mx-1">
            -{formatWithComma(log.cpc)}원
          </span>
          <span className="text-gray-700">지출되었습니다</span>
        </span>
      </td>
    </tr>
  );
}
