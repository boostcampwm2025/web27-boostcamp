import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';
import type { KeywordStatsResponse, KeywordStats } from './types';

interface UseKeywordStatsReturn {
  keywords: KeywordStats[];
  isLoading: boolean;
  error: string | null;
}

export function useKeywordStats(): UseKeywordStatsReturn {
  const [keywords, setKeywords] = useState<KeywordStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient<KeywordStatsResponse>(
          '/api/advertiser/keywords/stats'
        );

        setKeywords(response);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeywords();
  }, []);

  return { keywords, isLoading, error };
}
