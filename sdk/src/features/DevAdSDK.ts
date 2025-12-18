import type { TagExtractor, APIClient, AdRenderer } from '@/shared/types';

// DevAd SDK 메인 클래스 (전략 패턴)
export class DevAdSDK {
  constructor(
    public tagExtractor: TagExtractor,
    public apiClient: APIClient,
    public adRenderer: AdRenderer
  ) {}

  async init(): Promise<void> {
    const zones = document.querySelectorAll('[data-devad-zone]');

    if (zones.length === 0) {
      console.warn(
        '[DevAd SDK] 광고 존을 찾을 수 없습니다. <div data-devad-zone></div>를 추가해주세요.'
      );
      return;
    }

    // 태그 추출
    const tags = this.tagExtractor.extract();
    console.log('[DevAd SDK] 추출된 태그:', tags);

    if (tags.length === 0) {
      console.warn(
        '[DevAd SDK] 태그를 추출하지 못했습니다. 광고 매칭이 잘 되지 않을 수 있습니다.'
      );
    }

    const url = window.location.href;

    // 각 존마다 광고 요청 및 렌더링
    zones.forEach(async (zone, index) => {
      try {
        const data = await this.apiClient.fetchDecision(tags, url);
        this.adRenderer.render(data.winner, zone as HTMLElement);
      } catch (error) {
        console.error(`[DevAd SDK] Zone ${index + 1} 렌더링 실패:`, error);
        (zone as HTMLElement).innerHTML =
          '<div style="color: red;">광고 로드 실패</div>';
      }
    });
  }
}
