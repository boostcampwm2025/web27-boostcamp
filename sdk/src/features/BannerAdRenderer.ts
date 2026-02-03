import type { AdRenderer, Campaign } from '@shared/types';
import { AdTracker } from './AdTracker';

// 배너 광고 렌더러 (UI 렌더링만 담당)
export class BannerAdRenderer implements AdRenderer {
  private tracker: AdTracker;

  constructor(blogKey: string) {
    this.tracker = new AdTracker(blogKey);
  }

  render(
    campaign: Campaign | null,
    container: HTMLElement,
    auctionId: string,
    postUrl?: string,
    behaviorScore?: number,
    isHighIntent?: boolean
  ): void {
    this.tracker.reset();

    container.innerHTML = campaign
      ? this.renderAdWidget(campaign, container)
      : this.renderEmptyState();

    if (campaign) {
      // 광고 URL 저장 (클릭 시 사용)
      this.tracker.setAdUrl(campaign.url);

      const link = container.querySelector('.boostad-link');

      // 클릭/터치 이벤트 핸들러
      const handleClick = (e: Event) => {
        e.preventDefault();
        this.handleAdClick();
      };

      // PC: click 이벤트
      link?.addEventListener('click', handleClick);

      // 모바일: touchend 이벤트 (300ms 대기 없이 즉시 반응)
      link?.addEventListener('touchend', handleClick);

      // 광고 렌더링 성공 시 ViewLog 기록
      this.tracker.trackView(
        auctionId,
        campaign.id,
        postUrl || window.location.href,
        behaviorScore || 0,
        isHighIntent || false
      );
    }
  }

  private async handleAdClick(): Promise<void> {
    await this.tracker.trackClick();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private renderEmptyState(): string {
    return /*html*/ `
      <div style="
        padding: 10px;
        text-align: center;
        color: #999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        border: 1px dashed #ddd;
        border-radius: 8px;
        background: #fafafa;
      ">
        광고 없음
      </div>
    `;
  }

  private isMobileDevice(): boolean {
    // 1. User-Agent 체크
    const userAgent = navigator.userAgent.toLowerCase();
    const mobilePatterns = [
      /android/i,
      /webos/i,
      /iphone/i,
      /ipad/i,
      /ipod/i,
      /blackberry/i,
      /windows phone/i,
    ];
    const isMobileUA = mobilePatterns.some((pattern) =>
      pattern.test(userAgent)
    );

    // 2. Touch 지원 체크
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      ('msMaxTouchPoints' in navigator &&
        (navigator as { msMaxTouchPoints: number }).msMaxTouchPoints > 0);

    // 3. 화면 크기 체크
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth <= 768;

    // 복합 판단: (모바일 UA || 터치 지원) && 작은 화면
    return (isMobileUA || isTouchDevice) && isSmallScreen;
  }

  private renderAdWidget(campaign: Campaign, container: HTMLElement): string {
    // XSS 방지: 모든 사용자 입력 데이터 이스케이프
    const safeTitle = this.escapeHtml(campaign.title);
    const safeContent = this.escapeHtml(campaign.content);
    const safeUrl = this.escapeHtml(campaign.url);
    const safeImage = this.escapeHtml(campaign.image);

    const containerHeight = container.offsetHeight || container.clientHeight;

    // 모바일 디바이스 감지 (User-Agent + Touch + 화면 크기)
    if (this.isMobileDevice()) {
      return this.renderMobileWidget(
        safeTitle,
        safeContent,
        safeUrl,
        safeImage
      );
    }

    // S: 높이가 120px 이하일 때
    if (containerHeight > 0 && containerHeight <= 120) {
      return this.renderCompactWidget(
        safeTitle,
        safeContent,
        safeUrl,
        safeImage
      );
    }

    // M: 높이가 200px 이하일 때
    if (containerHeight > 120 && containerHeight <= 200) {
      return this.renderMediumWidget(
        safeTitle,
        safeContent,
        safeUrl,
        safeImage
      );
    }

    // 기본
    return this.renderFullWidget(safeTitle, safeContent, safeUrl, safeImage);
  }

  // Mobile (화면 너비 <= 768px)
  private renderMobileWidget(
    title: string,
    content: string,
    url: string,
    image: string
  ): string {
    return /*html*/ `
      <a href="${url}" class="boostad-link" target="_blank" rel="noopener noreferrer" style="
        display: block;
        width: 100%;
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background: #ffffff;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        transition: box-shadow 0.2s;
        box-sizing: border-box;
        margin: 16px 0;
      " onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';" onmouseout="this.style.boxShadow='0 2px 6px rgba(0,0,0,0.08)';">
        <div style="
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        ">
          <img src="${image}" alt="${title}" style="
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
          " onerror="this.style.display='none';" />
          <div style="flex: 1; min-width: 0; overflow: hidden;">
            <div style="font-size: 10px; color: #999; margin-bottom: 6px;">Sponsored</div>
            <div style="
              font-size: 15px;
              font-weight: 500;
              color: #333;
              line-height: 1.4;
              margin-bottom: 6px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            ">${title}</div>
          </div>
        </div>
        <div style="
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        ">${content}</div>
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="
            color: #155dfc;
            font-size: 13px;
            font-weight: 500;
            text-decoration: underline;
            text-decoration-color: transparent;
            text-underline-offset: 3px;
            transition: text-decoration-color 0.2s;
          " class="boostad-cta">더 알아보기 →</span>
          <span style="font-size: 10px; color: #99a1af; white-space: nowrap;">
            by <strong>BoostAD</strong>
          </span>
        </div>
      </a>
    `;
  }

  // S (h-20 ~ 120px)
  private renderCompactWidget(
    title: string,
    _content: string,
    url: string,
    image: string
  ): string {
    return /*html*/ `
      <a href="${url}" class="boostad-link" target="_blank" rel="noopener noreferrer" style="
        display: flex;
        align-items: center;
        gap: 12px;
        height: 100%;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #ffffff;
        text-decoration: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        transition: box-shadow 0.2s;
        box-sizing: border-box;
      " onmouseover="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.12)'; const cta=this.querySelector('.boostad-cta'); if(cta){cta.style.textDecorationColor='#155dfc';}" onmouseout="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.08)'; const cta=this.querySelector('.boostad-cta'); if(cta){cta.style.textDecorationColor='transparent';}">
        <img src="${image}" alt="${title}" style="
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        " onerror="this.style.display='none';" />
        <div style="flex: 1; min-width: 0; overflow: hidden;">
          <div style="
            font-size: 13px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">${title}</div>
          <div style="font-size: 10px; color: #999; margin-top: 2px;">Sponsored by BoostAD</div>
        </div>
        <span class="boostad-cta" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          color: #155dfc;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
          flex-shrink: 0;
          transition: text-decoration-color 0.2s;
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-offset: 3px;
        ">더 알아보기 →</span>
      </a>
    `;
  }

  // M (120px ~ 200px)
  private renderMediumWidget(
    title: string,
    content: string,
    url: string,
    image: string
  ): string {
    return /*html*/ `
      <div class="boostad-widget" style="
        display: flex;
        align-items: center;
        gap: 16px;
        height: 100%;
        padding: 12px 16px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        box-sizing: border-box;
      ">
        <img src="${image}" alt="${title}" style="
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        " onerror="this.style.display='none';" />
        <div style="flex: 1; min-width: 0; overflow: hidden;">
          <div style="font-size: 10px; color: #999; margin-bottom: 4px;">Sponsored</div>
          <div style="
            font-size: 15px;
            font-weight: 500;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          ">${title}</div>
          <div style="
            font-size: 12px;
            color: #666;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ">${content}</div>
        </div>
        <a href="${url}" class="boostad-link" target="_blank" rel="noopener noreferrer" style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 10px 8px 0;
          color: #155dfc;
          text-decoration: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 400;
          white-space: nowrap;
          flex-shrink: 0;
          transition: box-shadow 0.2s, text-decoration-color 0.2s;
          text-decoration: underline;
          text-decoration-color: transparent;
          text-underline-offset: 3px;
        " onmouseover="this.style.textDecorationColor='#155dfc';" onmouseout="this.style.textDecorationColor='transparent';" onfocus="this.style.textDecorationColor='#155dfc';" onblur="this.style.textDecorationColor='transparent';">더 알아보기 →</a>
      </div>
    `;
  }

  // 기본 (200px 이상)
  private renderFullWidget(
    title: string,
    content: string,
    url: string,
    image: string
  ): string {
    return /*html*/ `
      <div class="boostad-widget" style="
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        max-width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">

        <div style="
          font-size: 10px;
          color: #999;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Sponsored
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch;">
          <img src="${image}" alt="${title}" style="
            width: 200px;
            height: 200px;
            border-radius: 8px;
            object-fit: cover;
            flex-shrink: 0;
          " onerror="this.style.display='none';" />

          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column;">
            <h3 style="
              margin: 0 0 12px;
              font-size: 20px;
              font-weight: 500;
              color: #333;
              line-height: 1.4;
            ">${title}</h3>

            <p style="
              margin: 0 0 24px;
              color: #666;
              font-size: 15px;
              font-weight: 400;
              line-height: 1.6;
              flex-grow: 1;
            ">${content}</p>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: auto;
              padding-top: 16px;
              gap: 12px;
            ">
              <a href="${url}" class="boostad-link" target="_blank" rel="noopener noreferrer" style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 8px 10px 8px 0;
                color: #155dfc;
                text-decoration: none;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 400;
                transition: box-shadow 0.2s, text-decoration-color 0.2s;
                cursor: pointer;
                white-space: nowrap;
                text-decoration: underline;
                text-decoration-color: transparent;
                text-underline-offset: 3px;
              " onmouseover="this.style.textDecorationColor='#155dfc';" onmouseout="this.style.textDecorationColor='transparent';" onfocus="this.style.textDecorationColor='#155dfc';" onblur="this.style.textDecorationColor='transparent';">
                더 알아보기 →
              </a>

              <span style="font-size: 11px; color: #99a1af; white-space: nowrap;">
                by <strong>BoostAD</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
