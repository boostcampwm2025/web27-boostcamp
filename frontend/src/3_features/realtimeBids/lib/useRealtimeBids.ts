import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@shared/lib/api';
import { API_CONFIG } from '@shared/lib/api/config';
import type { RealtimeBidsData, BidLog } from './types';

interface UseRealtimeBidsParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  campaignIds?: string[];
}

interface UseRealtimeBidsReturn {
  bids: BidLog[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export function useRealtimeBids(
  params: UseRealtimeBidsParams = {}
): UseRealtimeBidsReturn {
  const { limit = 3, offset = 0, startDate, endDate, campaignIds } = params;
  const [bids, setBids] = useState<BidLog[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);

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
        if (campaignIds && campaignIds.length > 0) {
          params.append('campaignIds', campaignIds.join(','));
        }

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
  }, [limit, offset, startDate, endDate, campaignIds]);

  useEffect(() => {
    // 첫 페이지(offset=0)이고 캠페인 필터가 없을 때만 SSE 활성화
    if (offset !== 0 || (campaignIds && campaignIds.length > 0)) return;

    const eventSource = new EventSource(
      `${API_CONFIG.baseURL}/api/advertiser/bids/stream`,
      { withCredentials: true }
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const newBid: BidLog = JSON.parse(event.data);
        setBids((prev) => [newBid, ...prev].slice(0, limit));
      } catch (err) {
        console.error('[SSE] 메시지 파싱 오류:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[SSE] 연결 오류:', err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [limit, offset, startDate, endDate, campaignIds]);

  return { bids, total, hasMore, isLoading, error, isConnected };
}
