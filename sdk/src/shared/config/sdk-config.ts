import type { SDKConfig } from '../types';

// 스크립트 태그의 data-* 속성에서 설정값 읽기
// 사용 예시:
// - 자동 모드: <script src="sdk.js" data-blog-key="my-blog"></script>
// - 수동 모드: <script src="sdk.js" data-blog-key="my-blog" data-auto="false" data-context="협업도구"></script>
export function getSDKConfig(): SDKConfig {
  const script = document.currentScript as HTMLScriptElement | null;
  const autoValue = script?.dataset.auto;
  const contextValue = script?.dataset.context;

  if (autoValue === 'false' && contextValue) {
    return {
      blogKey: script?.dataset.blogKey || 'unknown',
      auto: false,
      context: contextValue,
    };
  }

  if (autoValue === 'false' && !contextValue) {
    console.warn('data-context가 존재하지 않아 수동->자동모드로 전환되었습니다.');
  }

  return {
    blogKey: script?.dataset.blogKey || 'unknown',
    auto: true,
  };
}
