import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';
import type { CreditHistoryResponse, CreditHistory } from './types';

interface UseCreditHistoryParams {
  limit?: number;
  offset?: number;
}

interface UseCreditHistoryReturn {
  total: number;
  hasMore: boolean;
  histories: CreditHistory[];
  isLoading: boolean;
  error: string | null;
}

export function useCreditHistory(
  params: UseCreditHistoryParams = {}
): UseCreditHistoryReturn {
  const { limit = 20, offset = 0 } = params;
  const [histories, setHistories] = useState<CreditHistory[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient<CreditHistoryResponse>(
          `/api/advertiser/credit/history?limit=${limit}&offset=${offset}`
        );

        setHistories(response.histories);
        setTotal(response.total);
        setHasMore(response.hasMore);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistories();
  }, [limit, offset]);

  return { histories, total, hasMore, isLoading, error };
}
