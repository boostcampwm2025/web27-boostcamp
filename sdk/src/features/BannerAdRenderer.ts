import type {
  AdRenderer,
  Campaign,
  ViewLogRequest,
  ViewLogResponse,
  ClickLogRequest,
  ClickLogResponse,
} from '@shared/types';
import { API_BASE_URL } from '@shared/config/constants';

// 배너 광고 렌더러
export class BannerAdRenderer implements AdRenderer {
  constructor(private readonly blogKey: string) {}

  private currentViewId: number | null = null;
  private currentAdUrl: string | null = null;

  render(
    campaign: Campaign | null,
    container: HTMLElement,
    auctionId: string,
    postUrl?: string,
    behaviorScore?: number,
    isHighIntent?: boolean
  ): void {
    container.innerHTML = campaign
      ? this.renderAdWidget(campaign, container)
      : this.renderEmptyState();

    if (campaign) {
      // 광고 URL 저장 (클릭 시 사용)
      this.currentAdUrl = campaign.url;

      const link = container.querySelector('.boostad-link');
      link?.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleAdClick();
      });

      // 광고 렌더링 성공 시 ViewLog 기록
      this.trackCampaignView(
        auctionId,
        campaign.id,
        postUrl || window.location.href,
        behaviorScore || 0,
        isHighIntent || false
      );
    }
  }

  private async trackCampaignView(
    auctionId: string,
    campaignId: string,
    postUrl: string,
    behaviorScore: number,
    isHighIntent: boolean
  ): Promise<void> {
    try {
      const requestBody: ViewLogRequest = {
        blogKey: this.blogKey,
        auctionId,
        campaignId,
        postUrl,
        isHighIntent,
        behaviorScore,
        positionRatio: null, // 일단 null로 전송
      };

      const response = await fetch(`${API_BASE_URL}/sdk/campaign-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data: ViewLogResponse = await response.json();
        this.currentViewId = data.data.viewId;
        console.log('[BoostAD SDK] ViewLog 기록 성공:', data.data.viewId);
      } else {
        console.warn('[BoostAD SDK] ViewLog 기록 실패:', response.status);
      }
    } catch (error) {
      console.error('[BoostAD SDK] ViewLog API 호출 실패:', error);
    }
  }

  private async handleAdClick(): Promise<void> {
    if (this.currentViewId === null) {
      console.warn(
        '[BoostAD SDK] ViewLog가 아직 기록되지 않았습니다. ClickLog를 기록하지 않습니다.'
      );
      return;
    }

    try {
      const requestBody: ClickLogRequest = {
        viewId: this.currentViewId,
        blogKey: this.blogKey,
        postUrl: window.location.href,
      };

      const response = await fetch(`${API_BASE_URL}/sdk/campaign-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data: ClickLogResponse = await response.json();
        if (!data.data.clickId) {
          console.log(
            '[BoostAD SDK] 중복 클릭으로 판단되어 예산이 차감되지 않습니다.'
          );
        } else {
          console.log('[BoostAD SDK] ClickLog 기록 성공:', data.data.clickId);
        }
      } else {
        console.warn('[BoostAD SDK] ClickLog 기록 실패:', response.status);
      }

      // 클릭 로그 성공/실패 여부와 관계없이 광고 페이지 열기
      if (this.currentAdUrl) {
        window.open(this.currentAdUrl, '_blank');
      }
    } catch (error) {
      console.error('[BoostAD SDK] ClickLog API 호출 실패:', error);
      // API 실패 시에도 광고 페이지는 열기
      if (this.currentAdUrl) {
        window.open(this.currentAdUrl, '_blank');
      }
    }
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

  private renderAdWidget(campaign: Campaign, container: HTMLElement): string {
    // XSS 방지: 모든 사용자 입력 데이터 이스케이프
    const safeTitle = this.escapeHtml(campaign.title);
    const safeContent = this.escapeHtml(campaign.content);
    const safeUrl = this.escapeHtml(campaign.url);
    const safeImage = this.escapeHtml(campaign.image);

    const containerHeight = container.offsetHeight || container.clientHeight;

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
            font-weight: 600;
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
            font-weight: 600;
            color: #333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 4px;
          ">${title}</div>
          <div style="
            font-size: 12px;
            color: #666;
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
        " onmouseover="this.style.textDecorationColor='#155dfc';" onmouseout="this.style.textDecorationColor='transparent';" onfocus="this.style.boxShadow='0 0 0 3px rgba(21,93,252,0.25)'; this.style.textDecorationColor='#155dfc';" onblur="this.style.boxShadow='none'; this.style.textDecorationColor='transparent';">더 알아보기 →</a>
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
              font-weight: 600;
              color: #333;
              line-height: 1.4;
            ">${title}</h3>

            <p style="
              margin: 0 0 24px;
              color: #666;
              font-size: 15px;
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
              " onmouseover="this.style.textDecorationColor='#155dfc';" onmouseout="this.style.textDecorationColor='transparent';" onfocus="this.style.boxShadow='0 0 0 3px rgba(21,93,252,0.25)'; this.style.textDecorationColor='#155dfc';" onblur="this.style.boxShadow='none'; this.style.textDecorationColor='transparent';">
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
