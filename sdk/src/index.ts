// IIFE로 전역 스코프 오염 방지 (기존 블로그 변수와 충돌 방지)
import { SDK_VERSION, TAGS } from './shared/config/constants';
import { getSDKConfig } from './shared/config/sdk-config';
import { TagExtractor } from './features/TagExtractor';
import { DecisionAPIClient } from './features/DecisionAPIClient';
import { BannerAdRenderer } from './features/BannerAdRenderer';
import { DevAdSDK } from './features/DevAdSDK';
import type {
  TagExtractor as TagExtractorInterface,
  AdRenderer,
} from './shared/types';
import './global.d.ts';

(function () {
  'use strict';

  const config = getSDKConfig();
  const tagExtractor = new TagExtractor(TAGS);
  const apiClient = new DecisionAPIClient(config);
  const adRenderer = new BannerAdRenderer(config);
  const sdk = new DevAdSDK(tagExtractor, apiClient, adRenderer);

  // DOM 로드 완료 후 SDK 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sdk.init());
  } else {
    sdk.init();
  }

  // 외부 API 노출 (프로토타입 테스트용, 확장성)
  window.DevAd = {
    version: SDK_VERSION,
    config,
    sdk,
    setTagExtractor(extractor: TagExtractorInterface) {
      sdk.tagExtractor = extractor;
      console.log('[DevAd SDK] 태그 추출기가 변경되었습니다');
    },
    setAdRenderer(renderer: AdRenderer) {
      sdk.adRenderer = renderer;
      console.log('[DevAd SDK] 광고 렌더러가 변경되었습니다');
    },
    reload() {
      sdk.init();
      console.log('[DevAd SDK] SDK가 다시 로드되었습니다');
    },
  };
})();
