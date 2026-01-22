import { useState } from 'react';
import { API_CONFIG } from '@shared/lib/api';
import type { CampaignFormData } from './types';

interface CreateCampaignRequest {
  title: string;
  content: string;
  image: string;
  url: string;
  tags: string[];
  maxCpc: number;
  dailyBudget: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
  isHighIntent: boolean;
}

interface CreateCampaignResponse {
  id: string;
  userId: number;
  title: string;
  content: string;
  image: string;
  url: string;
  maxCpc: number;
  dailyBudget: number;
  totalBudget: number;
  dailySpent: number;
  totalSpent: number;
  lastResetDate: string;
  isHighIntent: boolean;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  deletedAt: string | null;
  tags: { id: number; name: string }[];
}

interface UseCreateCampaignReturn {
  createCampaign: (formData: CampaignFormData) => Promise<CreateCampaignResponse>;
  isLoading: boolean;
  error: string | null;
}

function toISOString(dateString: string): string {
  return new Date(dateString).toISOString();
}

export function useCreateCampaign(): UseCreateCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async (
    formData: CampaignFormData
  ): Promise<CreateCampaignResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const { campaignContent, budgetSettings } = formData;

      const requestBody: CreateCampaignRequest = {
        title: campaignContent.title,
        content: campaignContent.content,
        image: campaignContent.image!,
        url: campaignContent.url,
        tags: campaignContent.tags.map((tag) => tag.name),
        maxCpc: budgetSettings.maxCpc,
        dailyBudget: budgetSettings.dailyBudget,
        totalBudget: budgetSettings.totalBudget,
        startDate: toISOString(budgetSettings.startDate),
        endDate: toISOString(budgetSettings.endDate),
        isHighIntent: campaignContent.isHighIntent,
      };

      const response = await fetch(`${API_CONFIG.baseURL}/api/campaigns`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || data.status === 'error') {
        const message = data.message || '캠페인 생성에 실패했습니다.';
        setError(message);
        throw new Error(message);
      }

      return data.data as CreateCampaignResponse;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '캠페인 생성에 실패했습니다.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCampaign, isLoading, error };
}
