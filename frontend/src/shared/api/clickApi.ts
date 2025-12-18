import type { ClickLog } from '../types/common';

interface TrackClickResponse {
  redirectUrl: string;
  logId: string;
  timestamp: string;
}

// SDK 래퍼: window.DevAd를 통해 API 호출
export const trackClick = async (
  campaignId: string,
  campaignName: string,
  url: string
): Promise<TrackClickResponse> => {
  return window.DevAd.trackClick(campaignId, campaignName, url);
};

export const getClickLogs = async (limit: number = 10): Promise<ClickLog[]> => {
  return window.DevAd.getClickLogs(limit);
};
