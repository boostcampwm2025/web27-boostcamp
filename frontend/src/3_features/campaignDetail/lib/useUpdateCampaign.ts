import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';
import type { UpdateCampaignRequest, CampaignDetail } from './types';

interface UseUpdateCampaignReturn {
  updateCampaign: (
    campaignId: string,
    data: UpdateCampaignRequest
  ) => Promise<CampaignDetail>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateCampaign(): UseUpdateCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCampaign = async (
    campaignId: string,
    data: UpdateCampaignRequest
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
        const message = result.message || '캠페인 수정에 실패했습니다';
        setError(message);
        throw new Error(message);
      }

      return result.data as CampaignDetail;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '캠페인 수정에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateCampaign, isLoading, error };
}
