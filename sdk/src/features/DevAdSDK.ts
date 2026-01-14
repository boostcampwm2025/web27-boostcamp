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
    const tags = this.tagExtractor.extract();
    console.log('[DevAd SDK] 추출된 태그:', tags);

    const postUrl = window.location.href;

    // 1차 광고: 본문 상단에 삽입
    const firstAdContainer = this.createAdContainer('devad-first-ad');
    const insertionPoint = this.findContentTop();

    if (insertionPoint) {
      insertionPoint.before(firstAdContainer);

      try {
        const data = await this.apiClient.fetchDecision(
          tags,
          postUrl,
          0,
          false
        );
        this.adRenderer.render(
          data.data.campaign,
          firstAdContainer,
          data.data.auctionId,
          postUrl,
          0,
          false
        );
      } catch {
        firstAdContainer.innerHTML =
          '<div style="color: #999; font-size: 14px; padding: 20px; text-align: center;">광고를 불러올 수 없습니다</div>';
      }
    }

    // 행동 추적 시작 + 70점 도달 시 2차 광고 요청
    this.behaviorTracker.onThresholdReached(() => {
      this.requestSecondAd(tags, postUrl);
    });
    this.behaviorTracker.start();
  }

  private createAdContainer(id: string): HTMLElement {
    const container = document.createElement('div');
    container.id = id;
    container.style.margin = '30px 0';
    return container;
  }

  private findContentTop(): Element | null {
    // 티스토리 블로그 본문 영역 찾기 (다양한 스킨 대응)
    const CONTENT_SELECTORS = [
      '.content',
      '.post-content',
      '.entry-content',
      'article',
      '.article-content',
      '[class*="content"]',
    ];

    for (const selector of CONTENT_SELECTORS) {
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
    const CONTENT_SELECTORS = [
      '.content',
      '.post-content',
      '.entry-content',
      'article',
      '.article-content',
      '[class*="content"]',
    ];

    let contentArea: Element | null = null;
    for (const selector of CONTENT_SELECTORS) {
      contentArea = document.querySelector(selector);
      if (contentArea) break;
    }

    if (!contentArea) return null;

    const paragraphs = contentArea.querySelectorAll('p');
    if (paragraphs.length === 0) return null;

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

  private async requestSecondAd(tags: Tag[], postUrl: string): Promise<void> {
    if (this.hasRequestedSecondAd) {
      console.log('[DevAd SDK] 2차 광고 이미 요청됨, 스킵');
      return;
    }

    this.hasRequestedSecondAd = true;

    const score = this.behaviorTracker.getCurrentScore();
    const isHighIntent = this.behaviorTracker.isHighIntent();

    console.log(
      '[DevAd SDK] 2차 광고 요청 - Score:',
      score,
      'HighIntent:',
      isHighIntent
    );

    // 2차 광고 컨테이너 생성 및 현재 스크롤 위치에 삽입
    const secondAdContainer = this.createAdContainer('devad-second-ad');
    const insertionPoint = this.findScrollBasedInsertionPoint();

    if (insertionPoint) {
      insertionPoint.after(secondAdContainer);

      try {
        const data = await this.apiClient.fetchDecision(
          tags,
          postUrl,
          score,
          isHighIntent
        );
        this.adRenderer.render(
          data.data.campaign,
          secondAdContainer,
          data.data.auctionId,
          postUrl,
          score,
          isHighIntent
        );
      } catch (error) {
        console.error('[DevAd SDK] 2차 광고 렌더링 실패:', error);
        secondAdContainer.innerHTML =
          '<div style="color: red; font-size: 14px; padding: 20px;">2차 광고 로드 실패</div>';
      }
    } else {
      console.warn('[DevAd SDK] 2차 광고 삽입 위치를 찾을 수 없습니다.');
    }
  }
}
