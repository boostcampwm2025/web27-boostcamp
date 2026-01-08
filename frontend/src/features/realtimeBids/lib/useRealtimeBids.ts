import { useState, useEffect } from 'react';
import { apiClient } from '@/shared/lib/api';
import type { RealtimeBidsResponse, BidLog } from './types';

interface UseRealtimeBidsParams {
  limit?: number;
  offset?: number;
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
  const { limit = 3, offset = 0 } = params;
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

        const response = await apiClient<RealtimeBidsResponse>(
          `/api/advertiser/bids/realtime?limit=${limit}&offset=${offset}`
        );

        setBids(response);
        setTotal(0);
        setHasMore(false);

      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [limit, offset]);

  return { bids, total, hasMore, isLoading, error };
}
