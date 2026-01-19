import type { KeywordStats } from '../lib/types';
import { LOW_CTR_THRESHOLD } from '../lib/constants';
import { Icon } from '@shared/ui/Icon';

interface KeywordStatsItemProps {
  keyword: KeywordStats;
  rank: number;
}

export function KeywordStatsItem({ keyword, rank }: KeywordStatsItemProps) {
  const isLowCtr = keyword.avgCtr < LOW_CTR_THRESHOLD;

  return (
    <div
      className={`flex flex-row items-center justify-between px-4 py-3 rounded-lg border ${
        isLowCtr ? 'bg-red-100 border-red-300' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-900">
            {keyword.name}
          </span>
          <Icon.Circle
            className={`w-2 h-2 ${isLowCtr ? 'text-red-700' : 'text-green-500'}`}
          />
          {isLowCtr && (
            <span className="px-1.5 py-0.5 bg-white border border-red-500 rounded text-xs font-semibold text-red-700">
              제거권장
            </span>
          )}
        </div>

        <div className="flex flex-row items-center gap-2 text-xs">
          <span className="text-gray-500">
            CTR{' '}
            <span className="text-gray-900">{keyword.avgCtr.toFixed(1)}%</span>
          </span>
          <span className="text-gray-500">
            노출 <span className="text-gray-900">{keyword.avgImpressions}</span>
          </span>
          <span className="text-gray-500">
            클릭 <span className="text-gray-900">{keyword.avgClicks}</span>
          </span>
        </div>
      </div>

      <span className="text-sm font-bold text-gray-900">{rank}위</span>
    </div>
  );
}
