import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';
import type { EarningsSummary } from './types';

interface UseEarningsSummaryReturn {
  data: EarningsSummary | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEarningsSummary(): UseEarningsSummaryReturn {
  const [data, setData] = useState<EarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient<EarningsSummary>(
        '/api/publisher/earnings/summary'
      );

      setData(response);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '수익 요약 조회에 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { data, isLoading, error, refetch: fetchSummary };
}
