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
    // 우측 윙배너 전용 스타일 적용 (position: fixed)
    this.applyWingBannerStyle(container);

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

  private applyWingBannerStyle(container: HTMLElement): void {
    // position: fixed로 우측 중앙에 고정
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.top = '50%';
    container.style.transform = 'translateY(-50%)';
    container.style.zIndex = '9999';
    container.style.width = '160px';

    // 반응형: 화면이 1280px 미만이면 숨김
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    container.style.display = mediaQuery.matches ? 'block' : 'none';

    mediaQuery.addEventListener('change', (e) => {
      container.style.display = e.matches ? 'block' : 'none';
    });
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
      console.warn(
        '[DevAd SDK] ViewLog가 아직 기록되지 않았습니다. ClickLog를 기록하지 않습니다.'
      );
      return;
    }

    try {
      const requestBody: ClickLogRequest = {
        viewId: this.currentViewId,
      };

      const response = await fetch(
        `${this.config.apiBase}/sdk/campaign-click`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

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
    return `
      <div class="devad-widget" style="
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 12px;
        width: 160px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: #ffffff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;
      " onmouseover="this.style.transform='scale(1.03)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';">

        <div style="
          font-size: 9px;
          color: #999;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">
          Sponsored
        </div>

        <img src="${campaign.image}" alt="${campaign.title}" style="
          width: 100%;
          border-radius: 6px;
          margin-bottom: 10px;
          object-fit: cover;
          height: 120px;
        " onerror="this.style.display='none';" />

        <h3 style="
          margin: 0 0 8px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        ">${campaign.title}</h3>

        <p style="
          margin: 0 0 10px;
          color: #666;
          font-size: 11px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        ">${campaign.content}</p>

        <a href="${campaign.url}" class="devad-link" target="_blank" style="
          display: block;
          padding: 8px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          transition: opacity 0.2s;
          cursor: pointer;
        " onmouseover="this.style.opacity='0.9';" onmouseout="this.style.opacity='1';">
          자세히 →
        </a>

        <div style="
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
          font-size: 9px;
          color: #aaa;
          text-align: center;
        ">
          by <strong>BoostAD</strong>
        </div>
      </div>
    `;
  }
}
