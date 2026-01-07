import type {
  TagExtractor,
  APIClient,
  AdRenderer,
  BehaviorTracker,
  Tag,
} from '@/shared/types';

// DevAd SDK 메인 클래스 (전략 패턴)
export class DevAdSDK {
  private hasRequestedSecondAd = false;

  constructor(
    public tagExtractor: TagExtractor,
    public apiClient: APIClient,
    public adRenderer: AdRenderer,
    public behaviorTracker: BehaviorTracker
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

    const postUrl = window.location.href;

    // 1차 광고 요청 (behaviorScore=0, isHighIntent=false)
    zones.forEach(async (zone, index) => {
      try {
        const data = await this.apiClient.fetchDecision(tags, postUrl, 0, false);
        this.adRenderer.render(data.data.campaign, zone as HTMLElement, data.data.auctionId);
      } catch (error) {
        console.error(`[DevAd SDK] Zone ${index + 1} 렌더링 실패:`, error);
        (zone as HTMLElement).innerHTML =
          '<div style="color: red;">광고 로드 실패</div>';
      }
    });

    // 행동 추적 시작 + 70점 도달 시 2차 광고 요청
    this.behaviorTracker.onThresholdReached(() => {
      this.requestSecondAd(tags, postUrl, zones);
    });
    this.behaviorTracker.start();
  }

  private async requestSecondAd(
    tags: Tag[],
    postUrl: string,
    zones: NodeListOf<Element>
  ): Promise<void> {
    if (this.hasRequestedSecondAd) {
      console.log('[DevAd SDK] 2차 광고 이미 요청됨, 스킵');
      return;
    }

    this.hasRequestedSecondAd = true;

    const score = this.behaviorTracker.getCurrentScore();
    const isHighIntent = this.behaviorTracker.isHighIntent();

    console.log('[DevAd SDK] 2차 광고 요청 - Score:', score, 'HighIntent:', isHighIntent);

    // 2차 광고 요청 (실제 behaviorScore, isHighIntent=true)
    zones.forEach(async (zone, index) => {
      try {
        const data = await this.apiClient.fetchDecision(tags, postUrl, score, isHighIntent);
        this.adRenderer.render(data.data.campaign, zone as HTMLElement, data.data.auctionId);
      } catch (error) {
        console.error(`[DevAd SDK] Zone ${index + 1} 2차 광고 렌더링 실패:`, error);
      }
    });
  }
}
