import { useState, useEffect } from 'react';
import { apiClient } from '@shared/lib/api';
import type { CampaignStatsResponse, CampaignStats } from './types';

interface UseCampaignStatsParams {
  limit?: number;
  offset?: number;
}

interface UseCampaignStatsReturn {
  total: number;
  hasMore: boolean;
  campaigns: CampaignStats[];
  isLoading: boolean;
  error: string | null;
}

export function useCampaignStats(params: UseCampaignStatsParams = {}): UseCampaignStatsReturn {
  const { limit = 3, offset = 0 } = params;
  const [campaigns, setCampaigns] = useState<CampaignStats[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient<CampaignStatsResponse>(
          `/api/advertiser/campaigns?limit=${limit}&offset=${offset}`
        );

        setCampaigns(response);
        setTotal(0);
        setHasMore(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [limit, offset]);

  return { campaigns, total, hasMore, isLoading, error };
}