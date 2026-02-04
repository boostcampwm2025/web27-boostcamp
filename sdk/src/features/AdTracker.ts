import type {
  ViewLogRequest,
  ViewLogResponse,
  ClickLogRequest,
  DismissLogRequest,
} from '@shared/types';
import { API_BASE_URL } from '@shared/config/constants';

// 광고 추적 담당 (ViewLog, ClickLog, Dismiss Beacon)
export class AdTracker {
  private currentViewId: number | null = null;
  private currentAdUrl: string | null = null;
  private hasClicked: boolean = false;
  private hasSentDismiss: boolean = false;

  constructor(private readonly blogKey: string) {
    this.registerBeaconListeners();
  }

  // ViewLog 기록
  async trackView(
    auctionId: string,
    campaignId: string,
    postUrl: string,
    behaviorScore: number,
    isHighIntent: boolean
  ): Promise<number | null> {
    try {
      const requestBody: ViewLogRequest = {
        blogKey: this.blogKey,
        auctionId,
        campaignId,
        postUrl,
        isHighIntent,
        behaviorScore,
        positionRatio: null,
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
        return data.data.viewId;
      } else {
        console.warn('[BoostAD SDK] ViewLog 기록 실패:', response.status);
        return null;
      }
    } catch (error) {
      console.error('[BoostAD SDK] ViewLog API 호출 실패:', error);
      return null;
    }
  }

  // ClickLog 기록
  async trackClick(): Promise<void> {
    this.hasClicked = true;

    if (this.currentViewId === null) {
      console.warn(
        '[BoostAD SDK] ViewLog가 아직 기록되지 않았습니다. ClickLog를 기록하지 않습니다.'
      );
      return;
    }

    const requestBody: ClickLogRequest = {
      viewId: this.currentViewId,
      blogKey: this.blogKey,
      postUrl: window.location.href,
    };

    // Beacon으로 ClickLog 전송 (비동기, 응답 안 기다림)
    const blob = new Blob([JSON.stringify(requestBody)], {
      type: 'application/json',
    });
    const url = `${API_BASE_URL}/sdk/campaign-click`;

    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(url, blob);
      console.log(
        `[BoostAD SDK] ClickLog Beacon 전송: ${sent ? '성공' : '실패'}`
      );
    } else {
      // Fallback: fetch with keepalive
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include',
        keepalive: true,
      }).catch((err) => {
        console.error('[BoostAD SDK] ClickLog Beacon fallback 실패:', err);
      });
    }

    // 즉시 광고 페이지 열기 (모바일 팝업 차단 방지)
    if (this.currentAdUrl) {
      window.open(this.currentAdUrl, '_blank');
    }
  }

  // Dismiss Beacon 전송 (페이지 이탈 시)
  sendDismissBeacon(): void {
    if (this.hasClicked || this.hasSentDismiss || this.currentViewId === null) {
      return;
    }

    this.hasSentDismiss = true;

    const payload: DismissLogRequest = {
      viewId: this.currentViewId,
      blogKey: this.blogKey,
      postUrl: window.location.href,
    };

    const blob = new Blob([JSON.stringify(payload)], {
      type: 'application/json',
    });
    const url = `${API_BASE_URL}/sdk/campaign-dismiss`;

    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(url, blob);
      console.log(
        `[BoostAD SDK] Beacon 전송: ${sent ? '성공' : '실패'} (viewId=${this.currentViewId})`
      );
    } else {
      // Fallback: fetch with keepalive (구형 브라우저)
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((err) => {
        console.error('[BoostAD SDK] Beacon fallback 실패:', err);
      });
    }
  }

  // 광고 URL 설정 (클릭 시 사용)
  setAdUrl(url: string): void {
    this.currentAdUrl = url;
  }

  // 상태 초기화 (새 광고 렌더링 시)
  reset(): void {
    // 이전 광고 Dismiss 처리
    if (
      this.currentViewId !== null &&
      !this.hasClicked &&
      !this.hasSentDismiss
    ) {
      console.log(
        `[BoostAD SDK] 새 광고 렌더링 전 이전 광고 Dismiss: viewId=${this.currentViewId}`
      );
      this.sendDismissBeacon();
    }

    this.currentViewId = null;
    this.currentAdUrl = null;
    this.hasClicked = false;
    this.hasSentDismiss = false;
  }

  // Beacon 이벤트 리스너 등록
  private registerBeaconListeners(): void {
    // beforeunload: 페이지 닫기, 새로고침, 뒤로가기 (Chrome, Firefox)
    window.addEventListener('beforeunload', () => {
      this.sendDismissBeacon();
    });

    // visibilitychange: 탭 전환, 백그라운드 전환 (모든 브라우저)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // 탭 전환 시 Dismiss 전송
        this.sendDismissBeacon();
      } else if (document.visibilityState === 'visible') {
        // 탭 복귀 시 상태 리셋 (다시 닫을 때를 대비)
        if (this.hasSentDismiss && !this.hasClicked) {
          console.log(
            '[BoostAD SDK] 탭 복귀 감지: hasSentDismiss 리셋 (viewId=' +
              this.currentViewId +
              ')'
          );
          this.hasSentDismiss = false;
        }
      }
    });

    // pagehide: 탭 닫기, 새로고침 (Chrome + Safari 보조)
    // persisted=true면 bfcache 저장 (진짜 종료 아님)
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) {
        // 진짜 페이지 종료
        this.sendDismissBeacon();
      }
    });

    // pageshow: bfcache에서 복원 시 상태 리셋 (Safari 호환)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // bfcache에서 복원됨 → 상태 리셋
        console.log('[BoostAD SDK] bfcache 복원 감지: hasSentDismiss 리셋');
        this.hasSentDismiss = false;
      }
    });
  }
}
