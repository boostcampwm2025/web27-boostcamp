// SDK 전역 타입 정의
import type {
  TagExtractor,
  AdRenderer,
  SDKConfig,
  Tag,
  DecisionResponse,
} from './shared/types';
import type { DevAdSDK } from './features/DevAdSDK';

// Click API 타입
export interface TrackClickResponse {
  redirectUrl: string;
  logId: string;
  timestamp: string;
}

export interface ClickLog {
  timestamp: string;
  campaignId: string;
  campaignName: string;
  url: string;
}

export interface DevAdSDKAPI {
  version: string;
  config: SDKConfig;
  sdk: DevAdSDK;
  setTagExtractor: (extractor: TagExtractor) => void;
  setAdRenderer: (renderer: AdRenderer) => void;
  reload: () => void;

  // Decision API 래퍼 (데모 페이지용)
  fetchDecision: (tags: Tag[], url: string) => Promise<DecisionResponse>;

  // Click API 래퍼 (데모 페이지용)
  trackClick: (
    campaignId: string,
    campaignName: string,
    url: string,
  ) => Promise<TrackClickResponse>;
  getClickLogs: (limit?: number) => Promise<ClickLog[]>;
}

declare global {
  interface Window {
    DevAd: DevAdSDKAPI;
  }
}

export {};
