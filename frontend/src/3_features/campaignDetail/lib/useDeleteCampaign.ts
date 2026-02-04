import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';

interface UseDeleteCampaignReturn {
  deleteCampaign: (campaignId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useDeleteCampaign(): UseDeleteCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCampaign = async (campaignId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/campaigns/${campaignId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        const message = result.message || '캠페인 삭제에 실패했습니다';
        setError(message);
        throw new Error(message);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '캠페인 삭제에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteCampaign, isLoading, error };
}
