import { useState, useMemo } from 'react';
import type { KeywordStats, SortKey } from '../lib/types';
import { KeywordStatsHeader } from './KeywordStatsHeader';
import { KeywordStatsItem } from './KeywordStatsItem';

// Mock 데이터 (API 연동 시 삭제)
const mockKeywords: KeywordStats[] = [
  { id: 1, name: 'Python', avgImpressions: 521, avgClicks: 98, avgCtr: 18.5 },
  { id: 2, name: 'Django', avgImpressions: 411, avgClicks: 60, avgCtr: 14.6 },
  { id: 3, name: 'React', avgImpressions: 380, avgClicks: 45, avgCtr: 11.8 },
  { id: 4, name: 'AWS', avgImpressions: 320, avgClicks: 21, avgCtr: 6.5 },
  { id: 5, name: 'Node.js', avgImpressions: 290, avgClicks: 35, avgCtr: 12.1 },
  {
    id: 6,
    name: 'TypeScript',
    avgImpressions: 250,
    avgClicks: 18,
    avgCtr: 7.2,
  },
];

export function KeywordStatsCard() {
  // TODO: API 연동 시 useKeywordStats 사용할 것!
  // const { keywords, isLoading, error } = useKeywordStats();
  const keywords = mockKeywords;
  const isLoading = false;
  const error = null;

  const [sortKey, setSortKey] = useState<SortKey>('avgCtr');

  const sortedKeywords = useMemo(() => {
    return [...keywords].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [keywords, sortKey]);

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <KeywordStatsHeader sortKey={sortKey} onSortChange={setSortKey} />
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <KeywordStatsHeader sortKey={sortKey} onSortChange={setSortKey} />
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <KeywordStatsHeader sortKey={sortKey} onSortChange={setSortKey} />

      <div className="p-4 flex flex-col gap-2 max-h-72 overflow-y-auto">
        {sortedKeywords.map((keyword, index) => (
          <KeywordStatsItem
            key={keyword.id}
            keyword={keyword}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
