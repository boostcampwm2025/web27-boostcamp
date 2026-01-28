import { useCurrentUser } from './useCurrentUser';

interface UseAdvertiserBalanceReturn {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdvertiserBalance(): UseAdvertiserBalanceReturn {
  const { data, isLoading, error, refetch } = useCurrentUser();

  return {
    balance: data?.balance ?? null,
    isLoading,
    error: error ? '잔액 조회에 실패했습니다' : null,
    refetch,
  };
}
