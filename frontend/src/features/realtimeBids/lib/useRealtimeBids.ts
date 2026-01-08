import { useState, useEffect } from 'react';
// TODO: API 구현 후 주석 해제
// import { apiClient } from '@/shared/lib/api';
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

        // TODO: API 구현 후 실제 API 호출로 교체
        // const response = await apiClient<RealtimeBidsResponse>(
        //   `/api/advertiser/bids/realtime?limit=${limit}&offset=${offset}`
        // );
        // setBids(response); // response가 바로 BidLog 배열
        // setTotal(0);
        // setHasMore(false);

        // 임시 Mock 데이터 (실제 API 응답과 동일한 구조)
        const mockResponse: RealtimeBidsResponse = [
          {
            id: 7,
            timestamp: '2026-01-08T05:30:16.960Z',
            campaignId: '54e92912-e23d-471f-b700-81caf834da51',
            campaignTitle: '[Bootcamp] 풀스택 취업 패키지',
            blogKey: 'test-blog',
            blogName: '테스트 블로그',
            blogDomain: 'test.example.com',
            bidAmount: 1000,
            winAmount: 1000,
            isWon: true,
            isHighIntent: true,
            behaviorScore: 92,
          },
          {
            id: 4,
            timestamp: '2026-01-08T05:29:52.000Z',
            campaignId: '550e8400-e29b-41d4-a716-446655440000',
            campaignTitle: '[React] 프론트엔드 개발자 로드맵 강의',
            blogKey: 'test-blog',
            blogName: '테스트 블로그',
            blogDomain: 'test.example.com',
            bidAmount: 500,
            winAmount: 1000,
            isWon: false,
            isHighIntent: false,
            behaviorScore: 0,
          },
          {
            id: 5,
            timestamp: '2026-01-08T05:29:52.000Z',
            campaignId: '8996aebc-b62f-4c51-bce8-1ad2964a8b20',
            campaignTitle: '[Frontend] UI/UX 기초 가이드',
            blogKey: 'test-blog',
            blogName: '테스트 블로그',
            blogDomain: 'test.example.com',
            bidAmount: 500,
            winAmount: 1000,
            isWon: false,
            isHighIntent: false,
            behaviorScore: 0,
          },
        ];

        setBids(mockResponse);
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
