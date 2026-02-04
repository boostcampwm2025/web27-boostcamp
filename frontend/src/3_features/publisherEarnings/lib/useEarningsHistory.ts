import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '@shared/lib/api';
import type { EarningsHistoryData, EarningsHistoryItem } from './types';

interface UseEarningsHistoryOptions {
  limit?: number;
  offset?: number;
}

interface UseEarningsHistoryReturn {
  data: EarningsHistoryItem[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEarningsHistory(
  options: UseEarningsHistoryOptions = {}
): UseEarningsHistoryReturn {
  const { limit = 10, offset = 0 } = options;

  const [data, setData] = useState<EarningsHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = `${API_CONFIG.baseURL}/api/publisher/earnings/history?offset=${offset}&limit=${limit}`;

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const rawData = await response.json();

      if (rawData.status === 'error') {
        throw new Error(rawData.message || '수익 히스토리 조회에 실패했습니다');
      }

      const historyData = rawData.data as EarningsHistoryData;

      setData(historyData.data);
      setTotal(historyData.total);
      setHasMore(historyData.hasMore);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '수익 히스토리 조회에 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, total, hasMore, isLoading, error, refetch: fetchHistory };
}
