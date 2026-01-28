import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';
import type { UpdateBudgetRequest, CampaignDetail } from './types';

interface UseUpdateBudgetReturn {
  updateBudget: (
    campaignId: string,
    data: UpdateBudgetRequest
  ) => Promise<CampaignDetail>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateBudget(): UseUpdateBudgetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBudget = async (
    campaignId: string,
    data: UpdateBudgetRequest
  ): Promise<CampaignDetail> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/campaigns/${campaignId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        const message = result.message || '예산 수정에 실패했습니다';
        setError(message);
        throw new Error(message);
      }

      return result.data as CampaignDetail;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '예산 수정에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateBudget, isLoading, error };
}
