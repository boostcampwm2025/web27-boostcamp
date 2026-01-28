import { useState, useEffect, useCallback } from 'react';
import type { SpendingLogItem, SpendingLogResponse } from './types';

function generateMockSpendingLogs(
  limit: number,
  offset: number
): SpendingLogResponse {
  const totalItems = 25;
  const logs: SpendingLogItem[] = [];

  const blogNames = [
    '개발자 김철수의 블로그',
    '코딩하는 이영희',
    '테크 블로그',
    '프로그래밍 일기',
    'JS 마스터',
  ];

  for (let i = offset; i < Math.min(offset + limit, totalItems); i++) {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15);

    logs.push({
      id: i + 1,
      createdAt: date.toISOString(),
      postUrl: `https://blog.example.com/post/${1000 + i}`,
      blogName: blogNames[i % blogNames.length],
      cpc: [300, 400, 500, 450, 350][i % 5],
      behaviorScore: Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 50 : null,
      isHighIntent: Math.random() > 0.5,
    });
  }

  return {
    total: totalItems,
    hasMore: offset + limit < totalItems,
    logs,
  };
}

interface UseSpendingLogParams {
  campaignId: string;
  limit?: number;
  offset?: number;
}

interface UseSpendingLogReturn {
  logs: SpendingLogItem[];
  total: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSpendingLog(
  params: UseSpendingLogParams
): UseSpendingLogReturn {
  const { campaignId, limit = 5, offset = 0 } = params;
  const [logs, setLogs] = useState<SpendingLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Mock 데이터 사용 (실제 API 연동 시 교체 필요!)
      await new Promise((resolve) => setTimeout(resolve, 300));
      const data = generateMockSpendingLogs(limit, offset);

      setLogs(data.logs);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '소진 기록을 불러오는데 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, limit, offset]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, hasMore, isLoading, error, refetch: fetchLogs };
}
