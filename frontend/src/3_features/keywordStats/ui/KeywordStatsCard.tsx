import { useState, useRef, useCallback } from 'react';
import type { KeywordStats, SortBy } from '../lib/types';
// import { useKeywordStats } from '../lib/useKeywordStats';
import { KeywordStatsHeader } from './KeywordStatsHeader';
import { KeywordStatsItem } from './KeywordStatsItem';

// Mock 데이터 (API 연동 시 삭제)
const allMockKeywords: KeywordStats[] = [
  {
    id: 1,
    name: 'Python',
    totalImpressions: 521,
    totalClicks: 98,
    avgCtr: 18.5,
  },
  {
    id: 2,
    name: 'Django',
    totalImpressions: 411,
    totalClicks: 60,
    avgCtr: 14.6,
  },
  {
    id: 3,
    name: 'React',
    totalImpressions: 380,
    totalClicks: 45,
    avgCtr: 11.8,
  },
  { id: 4, name: 'AWS', totalImpressions: 320, totalClicks: 21, avgCtr: 6.5 },
  {
    id: 5,
    name: 'Node.js',
    totalImpressions: 290,
    totalClicks: 35,
    avgCtr: 12.1,
  },
  {
    id: 6,
    name: 'TypeScript',
    totalImpressions: 250,
    totalClicks: 18,
    avgCtr: 7.2,
  },
  {
    id: 7,
    name: 'JavaScript',
    totalImpressions: 480,
    totalClicks: 72,
    avgCtr: 15.0,
  },
  { id: 8, name: 'Go', totalImpressions: 200, totalClicks: 28, avgCtr: 14.0 },
  { id: 9, name: 'Rust', totalImpressions: 150, totalClicks: 12, avgCtr: 8.0 },
  {
    id: 10,
    name: 'Java',
    totalImpressions: 350,
    totalClicks: 42,
    avgCtr: 12.0,
  },
  {
    id: 11,
    name: 'Kotlin',
    totalImpressions: 180,
    totalClicks: 15,
    avgCtr: 8.3,
  },
  {
    id: 12,
    name: 'Swift',
    totalImpressions: 220,
    totalClicks: 30,
    avgCtr: 13.6,
  },
  {
    id: 13,
    name: 'Flutter',
    totalImpressions: 170,
    totalClicks: 14,
    avgCtr: 8.2,
  },
  {
    id: 14,
    name: 'Docker',
    totalImpressions: 300,
    totalClicks: 38,
    avgCtr: 12.7,
  },
  {
    id: 15,
    name: 'Kubernetes',
    totalImpressions: 140,
    totalClicks: 10,
    avgCtr: 7.1,
  },
  {
    id: 16,
    name: 'GraphQL',
    totalImpressions: 160,
    totalClicks: 13,
    avgCtr: 8.1,
  },
  {
    id: 17,
    name: 'MongoDB',
    totalImpressions: 190,
    totalClicks: 22,
    avgCtr: 11.6,
  },
  {
    id: 18,
    name: 'PostgreSQL',
    totalImpressions: 210,
    totalClicks: 25,
    avgCtr: 11.9,
  },
];

const LIMIT = 4;

// Mock: 정렬 후 페이지네이션을 위한 코드 (API 연동 시 삭제)
function getMockKeywords(sortBy: SortBy, offset: number, limit: number) {
  const sorted = [...allMockKeywords].sort((a, b) => b[sortBy] - a[sortBy]);
  return sorted.slice(offset, offset + limit);
}

export function KeywordStatsCard() {
  const [sortBy, setSortBy] = useState<SortBy>('avgCtr');
  const [keywords, setKeywords] = useState<KeywordStats[]>(() =>
    getMockKeywords('avgCtr', 0, LIMIT)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // TODO: API 연동 시 useKeywordStats 사용할 것!
  // const { keywords, isLoading, isLoadingMore, error, hasMore, loadMore } = useKeywordStats({ sortBy });

  const handleSortChange = useCallback((newSortBy: SortBy) => {
    setSortBy(newSortBy);
    setIsLoading(true);

    // Mock: 정렬 변경을  위한 코드 (API 연동 시 삭제)
    setTimeout(() => {
      setKeywords(getMockKeywords(newSortBy, 0, LIMIT));
      setHasMore(allMockKeywords.length > LIMIT);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isNearBottom) {
      setIsLoadingMore(true);

      // Mock: 추가 로딩을 위한 코드 (API 연동 시 삭제)
      setTimeout(() => {
        const currentLength = keywords.length;
        const newKeywords = getMockKeywords(sortBy, currentLength, LIMIT);

        if (newKeywords.length > 0) {
          setKeywords((prev) => [...prev, ...newKeywords]);
          setHasMore(
            currentLength + newKeywords.length < allMockKeywords.length
          );
        } else {
          setHasMore(false);
        }
        setIsLoadingMore(false);
      }, 500);
    }
  }, [isLoadingMore, hasMore, keywords.length, sortBy]);

  if (isLoading) {
    return (
      <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
        <KeywordStatsHeader sortBy={sortBy} onSortChange={handleSortChange} />
        <div className="p-10 text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="text-gray-600 flex flex-col bg-white border border-gray-200 rounded-xl shadow">
      <KeywordStatsHeader sortBy={sortBy} onSortChange={handleSortChange} />

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
    </div>
  );
}
