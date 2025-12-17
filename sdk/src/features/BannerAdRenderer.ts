import type { AdRenderer, Campaign, SDKConfig } from '@/shared/types';

// 배너 광고 렌더러
export class BannerAdRenderer implements AdRenderer {
  constructor(private readonly config: SDKConfig) {}

  render(ad: Campaign | null, container: HTMLElement): void {
    container.innerHTML = ad ? this.renderAdWidget(ad) : this.renderEmptyState();
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

  private renderAdWidget(ad: Campaign): string {
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

        <img src="${ad.image}" alt="${ad.title}" style="
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
        ">${ad.title}</h3>

        <p style="
          margin: 0 0 16px;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        ">${ad.content}</p>

        <a href="${this.config.apiBase}/c/r/${ad.id}" style="
          display: inline-block;
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.2s;
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
