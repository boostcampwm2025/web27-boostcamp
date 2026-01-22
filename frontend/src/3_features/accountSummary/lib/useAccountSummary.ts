import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';

// 서버에서 받는 응답 형태
interface AccountSummaryResponse {
  performance: {
    totalClicks: number; // 총 클릭 수
    clicksChange: number; // 클릭 수 변화량
    totalImpressions: number; // 총 노출 수
    impressionsChange: number; // 노출 수 변화량
    averageCtr: number; // 평균 CTR
    averageCtrChange: number; // CTR 변화량
    totalSpent: number; // 총 사용 금액 (나중에 쓸 수도 있으니 타입에는 포함)
  };
  budget?: {
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
    spentToday: number;
    dailyTrend: Array<{
      date: string;
      spent: number;
    }>;
  };
}
interface UseAccountSummaryReturn {
  data: AccountSummaryResponse['performance'] | null;
  isLoading: boolean;
  error: string | null;
}

// 이 훅이 반환하는 것들
export function useAccountSummary(): UseAccountSummaryReturn {
  const [data, setData] = useState<
    AccountSummaryResponse['performance'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: userId 매개변수 필요
        const response = await apiClient<AccountSummaryResponse>(
          '/api/advertiser/dashboard/stats'
        );

        setData(response.performance);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, error };
}
