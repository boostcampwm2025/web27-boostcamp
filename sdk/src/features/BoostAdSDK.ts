import type {
  TagExtractor,
  APIClient,
  AdRenderer,
  BehaviorTracker,
  Tag,
} from '@/shared/types';

// BoostAD SDK 메인 클래스 (전략 패턴)
export class BoostAdSDK {
  private hasRequestedSecondAd = false;
  private readonly CONTENT_SELECTORS = [
    '#area_view',
    '#article-view',
    '#mArticle',
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
    public tagExtractor: TagExtractor,
    public apiClient: APIClient,
    public adRenderer: AdRenderer,
    public behaviorTracker: BehaviorTracker,
    private readonly isAutoMode: boolean
  ) {}

  async init(): Promise<void> {
    if (this.isAutoMode) {
      // 자동 모드: 블로그 포스트에 광고 자동 삽입
      await this.initAutoMode();
    } else {
      // 수동 모드: data-boostad-zone이 있는 곳에 광고 삽입
      await this.initManualMode();
    }
  }

  // ========================================
  // 자동 모드 (블로그)
  // ========================================

  private async initAutoMode(): Promise<void> {
    // 개별 포스트 페이지인지 확인
    if (!this.isPostPage()) {
      console.log(
        '[BoostAD SDK] 포스트 페이지가 아니므로 광고를 표시하지 않습니다.'
      );
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

    // 1차 광고 제거
    const firstAdContainer = document.getElementById('boostad-first-ad');
    if (firstAdContainer) {
      firstAdContainer.remove();
    }

    // 2차 광고 컨테이너 생성 및 현재 스크롤 위치에 삽입
    const secondAdContainer = this.createAdContainer('boostad-second-ad');
    const insertionPoint = this.findScrollBasedInsertionPoint();

    console.log('[BoostAD SDK] 2차 광고 삽입 위치:', insertionPoint);

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
    // 대표 도메인(메인 페이지)이면 광고 표시 안 함
    // 예: https://chazy.tistory.com/ → false
    // 예: https://chazy.tistory.com/123 → true
    const pathname = window.location.pathname;
    return pathname !== '/' && pathname !== '';
  }

  private findContentTop(): Element | null {
    for (const selector of this.CONTENT_SELECTORS) {
      const contentArea = document.querySelector(selector);
      if (contentArea) {
        const firstElement = contentArea.querySelector('p, h2');
        if (firstElement) {
          return firstElement;
        }
      }
    }

    return null;
  }

  private findScrollBasedInsertionPoint(): Element | null {
    let contentArea: Element | null = null;
    for (const selector of this.CONTENT_SELECTORS) {
      contentArea = document.querySelector(selector);
      if (contentArea) break;
    }

    console.log('[BoostAD SDK] 본문 영역 찾기:', contentArea);

    if (!contentArea) {
      console.warn('[BoostAD SDK] 본문 영역을 찾을 수 없습니다');
      return null;
    }

    const paragraphs = contentArea.querySelectorAll('p');
    console.log('[BoostAD SDK] <p> 태그 개수:', paragraphs.length);

    if (paragraphs.length === 0) {
      console.warn('[BoostAD SDK] <p> 태그를 찾을 수 없습니다');
      return null;
    }

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const targetY = scrollY + viewportHeight;

    const contentRect = contentArea.getBoundingClientRect();
    const contentBottom = contentRect.bottom + scrollY;

    // 스크롤이 본문을 넘어섰다면 본문의 마지막 <p> 태그 반환
    if (targetY > contentBottom) {
      return paragraphs[paragraphs.length - 1];
    }

    // 본문 내에서 스크롤 위치에 가장 가까운 <p> 태그 찾기
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