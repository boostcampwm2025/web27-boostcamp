import type {
  AdRenderer,
  Campaign,
  ViewLogRequest,
  ViewLogResponse,
  ClickLogRequest,
  ClickLogResponse,
} from '@/shared/types';
import { API_BASE_URL } from '@/shared/config/constants';

// 배너 광고 렌더러
export class BannerAdRenderer implements AdRenderer {
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
      ? this.renderAdWidget(campaign)
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
      };

      const response = await fetch(
        `${API_BASE_URL}/sdk/campaign-click`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data: ClickLogResponse = await response.json();
        console.log('[BoostAD SDK] ClickLog 기록 성공:', data.data.clickId);
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
    return `
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

  private renderAdWidget(campaign: Campaign): string {
    // XSS 방지: 모든 사용자 입력 데이터 이스케이프
    const safeTitle = this.escapeHtml(campaign.title);
    const safeContent = this.escapeHtml(campaign.content);
    const safeUrl = this.escapeHtml(campaign.url);
    const safeImage = this.escapeHtml(campaign.image);

    return `
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
          <img src="${safeImage}" alt="${safeTitle}" style="
            max-width: 200px;
            width: 100%;
            aspect-ratio: 1/1;
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
            ">${safeTitle}</h3>

            <p style="
              margin: 0 0 24px;
              color: #666;
              font-size: 15px;
              line-height: 1.6;
              flex-grow: 1;
            ">${safeContent}</p>

            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: auto;
              padding-top: 16px;
              gap: 12px;
            ">
              <a href="${safeUrl}" class="boostad-link" target="_blank" rel="noopener noreferrer" style="
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                transition: opacity 0.2s;
                cursor: pointer;
                white-space: nowrap;
              " onmouseover="this.style.opacity='0.9';" onmouseout="this.style.opacity='1';">
                자세히 보기 →
              </a>

              <span style="font-size: 11px; color: #aaa; white-space: nowrap;">
                by <strong>BoostAD</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
