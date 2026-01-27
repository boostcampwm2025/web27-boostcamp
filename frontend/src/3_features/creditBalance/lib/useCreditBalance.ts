import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';

interface UseCreditBalanceReturn {
  balance: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UserMeResponse {
  userId: number;
  role: string;
  email: string;
  balance?: number;
}

export function useCreditBalance(): UseCreditBalanceReturn {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient<UserMeResponse>('/api/users/me');
      setBalance(response.balance || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return { balance, isLoading, error, refetch: fetchBalance };
}
