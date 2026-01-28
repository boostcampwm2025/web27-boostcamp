import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';
import type { CampaignDetail, CampaignStatus } from './types';

interface UsePauseCampaignReturn {
  togglePause: (
    campaignId: string,
    currentStatus: CampaignStatus
  ) => Promise<CampaignDetail>;
  isLoading: boolean;
  error: string | null;
}

export function usePauseCampaign(): UsePauseCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePause = async (
    campaignId: string,
    currentStatus: CampaignStatus
  ): Promise<CampaignDetail> => {
    setIsLoading(true);
    setError(null);

    // ACTIVE(진행) -> PAUSED(중단), PAUSED(중단) -> ACTIVE(진행) 으로 변경
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}/api/campaigns/${campaignId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status === 'error') {
        const message = result.message || '캠페인 상태 변경에 실패했습니다';
        setError(message);
        throw new Error(message);
      }

      return result.data as CampaignDetail;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '캠페인 상태 변경에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { togglePause, isLoading, error };
}
