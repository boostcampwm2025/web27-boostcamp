import { Icon } from '@/shared/ui/Icon/Icon';
import type { ClickLog as ClickLogType } from '@/shared/types/common';

interface ClickLogProps {
  logs: ClickLogType[];
}

export const ClickLog = ({ logs }: ClickLogProps) => {
  if (logs.length === 0) {
    return <p className="text-neutral-500 text-sm">클릭 로그가 없습니다.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-3">
        최근 클릭 로그:
      </h3>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={`${log.campaignId}-${index}`}
            className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Icon
              name="clock"
              size={16}
              className="text-neutral-500 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {log.campaignName}
              </p>
              <p className="text-xs text-neutral-500">{log.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
