// DevAd SDK 전역 타입 정의
import type { Tag, MatchedCampaign } from './shared/types/common';

interface TrackClickResponse {
  redirectUrl: string;
  logId: string;
  timestamp: string;
}

interface ClickLog {
  timestamp: string;
  campaignId: string;
  campaignName: string;
  url: string;
}

interface DecisionResponse {
  winner: MatchedCampaign | null;
  candidates: MatchedCampaign[];
}

interface DevAdSDKAPI {
  version: string;
  config: {
    blogId: string;
    apiBase: string;
  };
  sdk: unknown;
  setTagExtractor: (extractor: unknown) => void;
  setAdRenderer: (renderer: unknown) => void;
  reload: () => void;

  // Decision API 래퍼
  fetchDecision: (tags: Tag[], url: string) => Promise<DecisionResponse>;

  // Click API 래퍼
  trackClick: (
    campaignId: string,
    campaignName: string,
    url: string
  ) => Promise<TrackClickResponse>;
  getClickLogs: (limit?: number) => Promise<ClickLog[]>;
}

declare global {
  interface Window {
    DevAd: DevAdSDKAPI;
  }
}

export {};
