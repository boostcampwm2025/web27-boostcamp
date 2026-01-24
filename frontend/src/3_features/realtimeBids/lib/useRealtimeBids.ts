import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';
import type { RealtimeBidsData, BidLog } from './types';

interface UseRealtimeBidsParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

interface UseRealtimeBidsReturn {
  bids: BidLog[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useRealtimeBids(
  params: UseRealtimeBidsParams = {}
): UseRealtimeBidsReturn {
  const { limit = 3, offset = 0, startDate, endDate } = params;
  const [bids, setBids] = useState<BidLog[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await apiClient<RealtimeBidsData>(
          `/api/advertiser/bids/realtime?${params.toString()}`
        );

        setBids(response.bids);
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

    fetchBids();
  }, [limit, offset, startDate, endDate]);

  return { bids, total, hasMore, isLoading, error };
}
