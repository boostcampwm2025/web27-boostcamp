// IIFE로 전역 스코프 오염 방지 (기존 블로그 변수와 충돌 방지)
import { TAGS } from './shared/config/constants';
import { getSDKConfig } from './shared/config/sdk-config';
import { TagExtractor } from './features/TagExtractor';
import { DecisionAPIClient } from './features/DecisionAPIClient';
import { BannerAdRenderer } from './features/BannerAdRenderer';
import { BehaviorTracker } from './features/BehaviorTracker';
import { BoostAdSDK } from './features/BoostAdSDK';

(function () {
  'use strict';

  const config = getSDKConfig();
  const tagExtractor = new TagExtractor(TAGS);
  const apiClient = new DecisionAPIClient(config);
  const adRenderer = new BannerAdRenderer(config.blogKey);
  const behaviorTracker = new BehaviorTracker();
  const sdk = new BoostAdSDK(
    tagExtractor,
    apiClient,
    adRenderer,
    behaviorTracker,
    config.auto // 자동/수동 모드 플래그
  );

  console.log(
    `[BoostAD SDK] ${config.auto ? '자동' : '수동'} 모드로 초기화됩니다.`
  );

  // DOM 로드 완료 후 SDK 자동 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sdk.init());
  } else {
    sdk.init();
  }
})();
