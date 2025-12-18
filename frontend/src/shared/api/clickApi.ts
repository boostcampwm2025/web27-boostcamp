import type { ClickLog } from '../types/common';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface TrackClickResponse {
  redirectUrl: string;
  logId: string;
  timestamp: string;
}

export const trackClick = async (
  campaignId: string,
  campaignName: string,
  url: string,
): Promise<TrackClickResponse> => {
  const response = await fetch(`${API_BASE_URL}/click/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ campaignId, campaignName, url }),
  });

  if (!response.ok) {
    throw new Error(`Failed to track click: ${response.statusText}`);
  }

  return response.json();
};

export const getClickLogs = async (limit: number = 10): Promise<ClickLog[]> => {
  const response = await fetch(`${API_BASE_URL}/click/logs?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch click logs: ${response.statusText}`);
  }

  return response.json();
};
