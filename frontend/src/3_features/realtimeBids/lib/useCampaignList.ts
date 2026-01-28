import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@shared/lib/api';

export interface Campaign {
  id: string;
  title: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'ENDED';
}

interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
}

export function useCampaignList() {
  return useQuery({
    queryKey: ['campaigns', 'list'],
    queryFn: async () => {
      try {
        const response = await apiClient<CampaignListResponse>(
          '/api/campaigns?offset=0&limit=100'
        );
        console.log('[useCampaignList] Response:', response);
        return response.campaigns || [];
      } catch (error) {
        console.error('[useCampaignList] Error:', error);
        return [];
      }
    },
    retry: 1,
  });
}
