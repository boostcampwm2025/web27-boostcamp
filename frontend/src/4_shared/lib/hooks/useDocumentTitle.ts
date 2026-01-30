import { useEffect } from 'react';

const DEFAULT_TITLE = 'BoostAD - 개발자 중심의 광고 플랫폼';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} | BoostAD` : DEFAULT_TITLE;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
