import { useState, useRef, useCallback } from 'react';
import type { SortBy } from '../lib/types';
import { useKeywordStats } from '../lib/useKeywordStats';
import { KeywordStatsHeader } from './KeywordStatsHeader';
import { KeywordStatsItem } from './KeywordStatsItem';

export function KeywordStatsCard() {
  const [sortBy, setSortBy] = useState<SortBy>('avgCtr');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { keywords, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useKeywordStats({ sortBy });

  const handleSortChange = useCallback((newSortBy: SortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isNearBottom) {
      loadMore();
    }
  }, [isLoadingMore, hasMore, loadMore]);

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <KeywordStatsHeader sortBy={sortBy} onSortChange={handleSortChange} />
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <KeywordStatsHeader sortBy={sortBy} onSortChange={handleSortChange} />
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <KeywordStatsHeader sortBy={sortBy} onSortChange={handleSortChange} />

      {keywords.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          키워드 성과 데이터가 없습니다.
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-4 flex flex-col gap-2 max-h-56.5 overflow-y-auto"
        >
          {keywords.map((keyword, index) => (
            <KeywordStatsItem
              key={keyword.id}
              keyword={keyword}
              rank={index + 1}
            />
          ))}

          {isLoadingMore && (
            <div className="py-2 text-center text-sm text-gray-500">
              로딩 중...
            </div>
          )}

          {!hasMore && keywords.length > 0 && (
            <div className="py-2 text-center text-xs text-gray-400">
              모든 키워드를 불러왔습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
