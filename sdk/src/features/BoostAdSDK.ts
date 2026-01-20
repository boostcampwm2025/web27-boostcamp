import type {
  TagExtractor,
  APIClient,
  AdRenderer,
  BehaviorTracker,
  Tag,
} from '@shared/types';

// BoostAD SDK 메인 클래스 (전략 패턴)
export class BoostAdSDK {
  private hasRequestedSecondAd = false;
  private readonly CONTENT_SELECTORS = [
    '#area_view',
    '#article-view',
    '#mArticle',
    '.blogview_content',
    '.article-view',
    '.article-content',
    '.post-content',
    '.entry-content',
    '.content',
    'article',
    '[class*="content"]',
    '[class*="article"]',
  ];

  constructor(
    private readonly tagExtractor: TagExtractor,
    private readonly apiClient: APIClient,
    private readonly adRenderer: AdRenderer,
    private readonly behaviorTracker: BehaviorTracker,
    private readonly isAutoMode: boolean
  ) {}

  async init(): Promise<void> {
    if (this.isAutoMode) {
      await this.initAutoMode();
    } else {
      await this.initManualMode();
    }
  }

  // ========================================
  // 공통 메서드
  // ========================================

  private async fetchAndRenderAd(
    container: HTMLElement,
    tags: Tag[],
    postUrl: string,
    behaviorScore: number,
    isHighIntent: boolean
  ): Promise<void> {
    try {
      const data = await this.apiClient.fetchDecision(
        tags,
        postUrl,
        behaviorScore,
        isHighIntent
      );

      this.adRenderer.render(
        data.data.campaign,
        container,
        data.data.auctionId,
        postUrl,
        behaviorScore,
        isHighIntent
      );
    } catch (error) {
      console.error('[BoostAD SDK] 광고 로드 실패:', error);
      container.innerHTML =
        '<div style="color: #999; font-size: 14px; padding: 20px; text-align: center;">광고를 불러올 수 없습니다</div>';
    }
  }

  private createAdContainer(id: string): HTMLElement {
    const container = document.createElement('div');
    container.id = id;
    container.style.margin = '30px 0';
    return container;
  }

  // ========================================
  // 자동 모드 (블로그)
  // ========================================

  private async initAutoMode(): Promise<void> {
    if (!this.isPostPage()) {
      return;
    }

    const tags = this.tagExtractor.extract();
    console.log('[BoostAD SDK] 추출된 태그:', tags);

    const postUrl = window.location.href;

    // 1차 광고: 본문 상단에 삽입
    const firstAdContainer = this.createAdContainer('boostad-first-ad');
    const insertionPoint = this.findContentTop();

    if (insertionPoint) {
      insertionPoint.before(firstAdContainer);

      await this.fetchAndRenderAd(firstAdContainer, tags, postUrl, 0, false);
    }

    // 행동 추적 시작 + 70점 도달 시 2차 광고 요청 (스크롤 위치에 삽입)
    this.behaviorTracker.onThresholdReached(() => {
      this.requestSecondAdAutoMode(tags, postUrl);
    });
    this.behaviorTracker.start();
  }

  private async requestSecondAdAutoMode(
    tags: Tag[],
    postUrl: string
  ): Promise<void> {
    if (this.hasRequestedSecondAd) return;
    this.hasRequestedSecondAd = true;

    const score = this.behaviorTracker.getCurrentScore();
    const isHighIntent = this.behaviorTracker.isHighIntent();

    console.log(
      '[BoostAD SDK] 2차 광고 요청 - Score:',
      score,
      'HighIntent:',
      isHighIntent
    );

    // 1차 광고 제거
    document.getElementById('boostad-first-ad')?.remove();

    // 2차 광고: 현재 스크롤 위치에 삽입
    const secondAdContainer = this.createAdContainer('boostad-second-ad');
    const insertionPoint = this.findScrollBasedInsertionPoint();

    if (insertionPoint) {
      insertionPoint.after(secondAdContainer);

      await this.fetchAndRenderAd(
        secondAdContainer,
        tags,
        postUrl,
        score,
        isHighIntent
      );
    }
  }

  private isPostPage(): boolean {
    // 메인 페이지(/)가 아니면 포스트 페이지로 간주
    const pathname = window.location.pathname;
    return pathname !== '/' && pathname !== '';
  }

  private findContentTop(): Element | null {
    for (const selector of this.CONTENT_SELECTORS) {
      const contentArea = document.querySelector(selector);
      if (contentArea) {
        const firstElement = contentArea.querySelector('p, h2');
        if (firstElement) return firstElement;
      }
    }
    return null;
  }

  private findScrollBasedInsertionPoint(): Element | null {
    // 본문 영역 찾기
    let contentArea: Element | null = null;
    for (const selector of this.CONTENT_SELECTORS) {
      contentArea = document.querySelector(selector);
      if (contentArea) break;
    }

    if (!contentArea) {
      console.warn('[BoostAD SDK] 본문 영역을 찾을 수 없습니다');
      return null;
    }

    const paragraphs = contentArea.querySelectorAll('p');
    if (paragraphs.length === 0) {
      console.warn('[BoostAD SDK] <p> 태그를 찾을 수 없습니다');
      return null;
    }

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const targetY = scrollY + viewportHeight;

    const contentRect = contentArea.getBoundingClientRect();
    const contentBottom = contentRect.bottom + scrollY;

    // 스크롤이 본문 끝을 넘어섰다면 마지막 <p> 반환
    if (targetY > contentBottom) {
      return paragraphs[paragraphs.length - 1];
    }

    // 본문 내에서 스크롤 위치에 가장 가까운 <p> 찾기
    let closestParagraph: Element | null = null;
    let minDistance = Infinity;

    paragraphs.forEach((p) => {
      const rect = p.getBoundingClientRect();
      const pTop = rect.top + scrollY;
      const distance = Math.abs(pTop - targetY);

      if (distance < minDistance) {
        minDistance = distance;
        closestParagraph = p;
      }
    });

    return closestParagraph;
  }

  // ========================================
  // 수동 모드 (일반 웹페이지)
  // ========================================

  private async initManualMode(): Promise<void> {
    const zones = document.querySelectorAll('[data-boostad-zone]');

    if (zones.length === 0) {
      console.warn(
        '[BoostAD SDK] data-boostad-zone 요소를 찾을 수 없습니다. 광고를 표시하지 않습니다.'
      );
      return;
    }

    console.log(`[BoostAD SDK] 수동 모드: ${zones.length}개의 광고존 발견`);

    const tags = this.tagExtractor.extract();
    const postUrl = window.location.href;

    // 각 광고존에 1차 광고 삽입
    zones.forEach(async (zone) => {
      const container = zone as HTMLElement;
      container.style.margin = '30px 0';

      await this.fetchAndRenderAd(container, tags, postUrl, 0, false);
    });

    // 행동 추적 시작 + 70점 도달 시 2차 광고로 교체 (같은 위치)
    this.behaviorTracker.onThresholdReached(() => {
      this.requestSecondAdManualMode(tags, postUrl, zones);
    });
    this.behaviorTracker.start();
  }

  private async requestSecondAdManualMode(
    tags: Tag[],
    postUrl: string,
    zones: NodeListOf<Element>
  ): Promise<void> {
    if (this.hasRequestedSecondAd) {
      return;
    }

    this.hasRequestedSecondAd = true;

    const score = this.behaviorTracker.getCurrentScore();
    const isHighIntent = this.behaviorTracker.isHighIntent();

    console.log(
      '[BoostAD SDK] 2차 광고 요청 - Score:',
      score,
      'HighIntent:',
      isHighIntent
    );

    // 모든 광고존의 광고를 2차 광고로 교체
    zones.forEach(async (zone) => {
      const container = zone as HTMLElement;
      container.innerHTML = '';
      await this.fetchAndRenderAd(
        container,
        tags,
        postUrl,
        score,
        isHighIntent
      );
    });
  }
}
