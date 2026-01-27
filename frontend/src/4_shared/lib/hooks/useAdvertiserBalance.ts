import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';

interface AdvertiserBalanceResponse {
  balance: number;
}

interface UseAdvertiserBalanceReturn {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
}

export function useAdvertiserBalance(): UseAdvertiserBalanceReturn {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient<AdvertiserBalanceResponse>(
          '/api/advertiser/balance'
        );

        setBalance(response.balance);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '잔액 조회에 실패했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return { balance, isLoading, error };
}
