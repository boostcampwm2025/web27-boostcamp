import { useEffect, useState, useCallback } from 'react';
import { SDK_URL } from '@/shared/config/constants';

// DevAd SDK를 동적으로 로드하고 관리하는 Hook
export function useDevAdSDK() {
  const [sdkLoaded, setSdkLoaded] = useState(() => !!window.DevAd);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const loadSDK = useCallback(() => {
    if (window.DevAd) return;

    const existingScript = document.querySelector(`script[src="${SDK_URL}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = SDK_URL;
    script.dataset.blogId = 'mock-blog-react';
    script.dataset.debug = 'true';

    script.onload = () => {
      setSdkLoaded(true);
      setSdkError(null);
    };

    script.onerror = () => {
      setSdkError('SDK 로드 실패. Backend 서버가 실행 중인지 확인하세요.');
    };

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    loadSDK();
  }, [loadSDK]);

  // 태그 변경 시 광고 새로고침
  const reloadSDK = useCallback(() => {
    if (window.DevAd) {
      window.DevAd.reload();
    }
  }, []);

  return { sdkLoaded, sdkError, reloadSDK };
}
