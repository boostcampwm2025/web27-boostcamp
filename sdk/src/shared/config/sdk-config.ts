import type { SDKConfig } from '../types';

// 스크립트 태그의 data-* 속성에서 설정값 읽기
// 사용 예시:
// - 자동 모드: <script src="sdk.js" data-blog-key="my-blog"></script>
// - 수동 모드: <script src="sdk.js" data-blog-key="my-blog" data-auto="false"></script>
export function getSDKConfig(): SDKConfig {
  const script = document.currentScript as HTMLScriptElement | null;
  const autoValue = script?.dataset.auto;

  return {
    blogKey: script?.dataset.blogKey || 'unknown',
    auto: autoValue === undefined || autoValue === 'true', // 기본값: true (자동 모드)
  };
}
