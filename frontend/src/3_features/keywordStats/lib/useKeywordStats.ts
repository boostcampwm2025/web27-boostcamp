import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@shared/lib/api';
import type { KeywordStatsResponse, KeywordStats, SortBy } from './types';

const LIMIT = 6;

interface UseKeywordStatsParams {
  sortBy: SortBy;
}

interface UseKeywordStatsReturn {
  keywords: KeywordStats[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useKeywordStats({
  sortBy,
}: UseKeywordStatsParams): UseKeywordStatsReturn {
  const [keywords, setKeywords] = useState<KeywordStats[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 초기 로딩되거나 정렬 변경 시에 실행
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setPage(1);

        const response = await apiClient<KeywordStatsResponse>(
          `/api/advertiser/keywords/stats?sortBy=${sortBy}&order=desc&limit=${LIMIT}&offset=0`
        );

        setKeywords(response.keywords);
        setHasMore(response.hasMore);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, [sortBy]);

  // 스크롤이 카드 끝에 도달해 정보를 더 불러올 때 실행
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const offset = page * LIMIT;

      const response = await apiClient<KeywordStatsResponse>(
        `/api/advertiser/keywords/stats?sortBy=${sortBy}&order=desc&limit=${LIMIT}&offset=${offset}`
      );

      setKeywords((prev) => [...prev, ...response.keywords]);
      setPage(nextPage);
      setHasMore(response.hasMore);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [sortBy, page, isLoadingMore, hasMore]);

  return { keywords, isLoading, isLoadingMore, error, hasMore, loadMore };
}
