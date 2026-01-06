// IIFE로 전역 스코프 오염 방지 (기존 블로그 변수와 충돌 방지)
import { TAGS } from './shared/config/constants';
import { getSDKConfig } from './shared/config/sdk-config';
import { TagExtractor } from './features/TagExtractor';
import { DecisionAPIClient } from './features/DecisionAPIClient';
import { BannerAdRenderer } from './features/BannerAdRenderer';
import { DevAdSDK } from './features/DevAdSDK';

(function () {
  'use strict';

  const config = getSDKConfig();
  const tagExtractor = new TagExtractor(TAGS);
  const apiClient = new DecisionAPIClient(config);
  const adRenderer = new BannerAdRenderer(config);
  const sdk = new DevAdSDK(tagExtractor, apiClient, adRenderer);

  // DOM 로드 완료 후 SDK 자동 초기화
  const autoRenderZone = document.querySelector('[data-devad-zone]');

  if (autoRenderZone) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => sdk.init());
    } else {
      sdk.init();
    }
  } else {
    console.warn('[DevAd SDK] data-devad-zone 요소를 찾을 수 없습니다.');
  }
})();
