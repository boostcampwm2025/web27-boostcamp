// SDK 전역 타입 정의
import type { TagExtractor, AdRenderer, SDKConfig } from './shared/types';
import type { DevAdSDK } from './features/DevAdSDK';

export interface DevAdSDKAPI {
  version: string;
  config: SDKConfig;
  sdk: DevAdSDK;
  setTagExtractor: (extractor: TagExtractor) => void;
  setAdRenderer: (renderer: AdRenderer) => void;
  reload: () => void;
}

declare global {
  interface Window {
    DevAd: DevAdSDKAPI;
  }
}

export {};
