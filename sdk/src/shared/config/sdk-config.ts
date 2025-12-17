import type { SDKConfig } from '../types';
import { DEFAULT_API_BASE_URL } from './constants';

// 스크립트 태그의 data-* 속성에서 설정값 읽기
// 사용: <script src="sdk.js" data-blog-id="my-blog" data-api-base="..."></script>
export function getSDKConfig(): SDKConfig {
  const script = document.currentScript as HTMLScriptElement | null;

  return {
    blogId: script?.dataset.blogId || 'unknown',
    apiBase: script?.dataset.apiBase || DEFAULT_API_BASE_URL,
  };
}
