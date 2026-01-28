import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@shared/lib/api';
import type { CampaignDetail } from './types';

interface UseCampaignDetailReturn {
  campaign: CampaignDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCampaignDetail(campaignId: string): UseCampaignDetailReturn {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await apiClient<CampaignDetail>(
        `/api/campaigns/${campaignId}`
      );

      setCampaign(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '캠페인을 불러오는데 실패했습니다';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return { campaign, isLoading, error, refetch: fetchCampaign };
}
