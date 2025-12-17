// Window 객체 타입 확장 (DevAd SDK)
export interface DevAdSDK {
  version: string;
  config: {
    blogId: string;
    apiBase: string;
  };
  sdk: {
    tagExtractor: unknown;
    apiClient: unknown;
    adRenderer: unknown;
    init: () => Promise<void>;
  };
  setTagExtractor: (extractor: unknown) => void;
  setAdRenderer: (renderer: unknown) => void;
  reload: () => void;
}

declare global {
  interface Window {
    DevAd?: DevAdSDK;
  }
}

export {};
