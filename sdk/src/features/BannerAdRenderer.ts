import type {
  AdRenderer,
  Campaign,
  SDKConfig,
  ViewLogRequest,
  ViewLogResponse,
  ClickLogRequest,
  ClickLogResponse,
} from '@/shared/types';

// 배너 광고 렌더러
export class BannerAdRenderer implements AdRenderer {
  private currentViewId: number | null = null;
  private currentAdUrl: string | null = null;

  constructor(private readonly config: SDKConfig) {}

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

      const link = container.querySelector('.devad-link');
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

      const response = await fetch(`${this.config.apiBase}/sdk/campaign-view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data: ViewLogResponse = await response.json();
        this.currentViewId = data.data.viewId;
        console.log('[DevAd SDK] ViewLog 기록 성공:', data.data.viewId);
      } else {
        console.warn('[DevAd SDK] ViewLog 기록 실패:', response.status);
      }
    } catch (error) {
      console.error('[DevAd SDK] ViewLog API 호출 실패:', error);
    }
  }

  private async handleAdClick(): Promise<void> {
    if (this.currentViewId === null) {
      console.warn('[DevAd SDK] ViewLog가 아직 기록되지 않았습니다. ClickLog를 기록하지 않습니다.');
      return;
    }

    try {
      const requestBody: ClickLogRequest = {
        viewId: this.currentViewId,
      };

      const response = await fetch(`${this.config.apiBase}/sdk/campaign-click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data: ClickLogResponse = await response.json();
        console.log('[DevAd SDK] ClickLog 기록 성공:', data.data.clickId);
      } else {
        console.warn('[DevAd SDK] ClickLog 기록 실패:', response.status);
      }

      // 클릭 로그 성공/실패 여부와 관계없이 광고 페이지 열기
      if (this.currentAdUrl) {
        window.open(this.currentAdUrl, '_blank');
      }
    } catch (error) {
      console.error('[DevAd SDK] ClickLog API 호출 실패:', error);
      // API 실패 시에도 광고 페이지는 열기
      if (this.currentAdUrl) {
        window.open(this.currentAdUrl, '_blank');
      }
    }
  }

  private renderEmptyState(): string {
    return `
      <div style="
        padding: 20px;
        text-align: center;
        color: #999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        border: 1px dashed #ddd;
        border-radius: 8px;
        background: #fafafa;
      ">
        매칭되는 광고가 없습니다
      </div>
    `;
  }

  private renderAdWidget(campaign: Campaign): string {
    return `
      <div class="devad-widget" style="
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        padding: 20px;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">

        <div style="
          font-size: 11px;
          color: #999;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Sponsored
        </div>

        <img src="${campaign.image}" alt="${campaign.title}" style="
          width: 100%;
          border-radius: 8px;
          margin-bottom: 16px;
          object-fit: cover;
          height: 200px;
        " onerror="this.style.display='none';" />

        <h3 style="
          margin: 0 0 12px;
          font-size: 20px;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
        ">${campaign.title}</h3>

        <p style="
          margin: 0 0 16px;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        ">${campaign.content}</p>

        <a href="${campaign.url}" class="devad-link" target="_blank" style="
          display: inline-block;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.2s;
          cursor: pointer;
        " onmouseover="this.style.opacity='0.9';" onmouseout="this.style.opacity='1';">
          자세히 보기 →
        </a>

        <div style="
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          font-size: 11px;
          color: #aaa;
        ">
          Powered by <strong>DevAd</strong>
        </div>
      </div>
    `;
  }
}
