import type { BehaviorTracker as BehaviorTrackerInterface } from '@shared/types';

// 사용자 행동 추적 (스크롤, 시간, 복사)
export class BehaviorTracker implements BehaviorTrackerInterface {
  private metrics = {
    scrollDepth: 0,
    timeOnPage: 0,
    copyEvents: 0,
    relatedDocClicks: 0,
    codeBlockCopies: 0,
    score: 0,
  };

  private startTime: number = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private thresholdReached = false;
  private thresholdCallback: (() => void) | null = null;

  start(): void {
    this.startTime = Date.now();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', this.handleScroll);

    // 클릭 이벤트 리스너 등록
    document.addEventListener('click', this.handleDocClick);

    // 복사 이벤트 리스너 등록
    document.addEventListener('copy', this.handleCopy);

    // 1초마다 체류 시간 업데이트
    this.timerInterval = setInterval(() => {
      this.metrics.timeOnPage = Math.floor(
        (Date.now() - this.startTime) / 1000
      );
      this.checkThreshold();
    }, 1000);

    console.log('[BoostAD SDK] 행동 추적 시작');
  }

  stop(): void {
    // 이벤트 리스너 제거
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('copy', this.handleCopy);
    document.removeEventListener('click', this.handleDocClick)
    // 타이머 정리
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    console.log('[BoostAD SDK] 행동 추적 중지');
  }

  getCurrentScore(): number {
    return this.metrics.score;
  }

  isHighIntent(): boolean {
    return this.metrics.score >= 70;
  }

  onThresholdReached(callback: () => void): void {
    this.thresholdCallback = callback;
  }
  private handleDocClick = (): void => {};
  private handleScroll = (): void => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    // 스크롤 깊이 계산 (0-100%)
    const prevDepth = this.metrics.scrollDepth;
    const denominator = scrollHeight - clientHeight;
    const scrollPercent = denominator > 0 ? (scrollTop / denominator) * 100 : 0;
    const clampedScrollPercent = Math.min(100, Math.max(0, scrollPercent));

    // 최대 스크롤 깊이만 기록 (위로 올려도 점수 유지)
    this.metrics.scrollDepth = Math.max(
      this.metrics.scrollDepth,
      clampedScrollPercent
    );

    // 스크롤 임계값 통과 시 로그
    if (prevDepth < 50 && this.metrics.scrollDepth >= 50) {
      console.log('[BoostAD SDK] 스크롤 50% 달성 → +20점');
    } else if (prevDepth < 80 && this.metrics.scrollDepth >= 80) {
      console.log('[BoostAD SDK] 스크롤 80% 달성 → +30점 (총합)');
    }

    this.checkThreshold();
  };

  private handleCopy = (): void => {
    const selection = window.getSelection();
    const isCodeBlock = this.isSelectionInCodeBlock(selection);

    if (isCodeBlock) {
      this.metrics.codeBlockCopies++;
      console.log(
        `[BoostAD SDK] 코드 블록 복사 감지 (${this.metrics.codeBlockCopies}회) → +${this.metrics.codeBlockCopies * 15}점`
      );
    } else {
      this.metrics.copyEvents++;
      console.log(
        `[BoostAD SDK] 일반 복사 이벤트 감지 (${this.metrics.copyEvents}회) → +${this.metrics.copyEvents * 5}점`
      );
    }

    this.checkThreshold();
  };

  private isSelectionInCodeBlock(selection: Selection | null): boolean {
    if (!selection || selection.rangeCount === 0) {
      return false;
    }

    let node: Node | null = selection.getRangeAt(0).commonAncestorContainer;

    // DOM 트리를 거슬러 올라가면서 <pre>, <code> 태그 찾기
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const tagName = element.tagName.toUpperCase();

        // <pre> 또는 <code> 태그 발견
        if (tagName === 'PRE' || tagName === 'CODE') {
          return true;
        }

        // 티스토리, 벨로그 등 코드 블록 클래스 감지
        const className = element.className || '';
        if (
          className.includes('code') ||
          className.includes('hljs') ||
          className.includes('language-') ||
          className.includes('highlight')
        ) {
          return true;
        }
      }
      node = node.parentNode;
    }

    return false;
  }

  private calculateScore(): void {
    let score = 0;

    // 스크롤 점수
    if (this.metrics.scrollDepth >= 80) {
      score += 30;
    } else if (this.metrics.scrollDepth >= 50) {
      score += 20;
    }

    // 체류 시간 점수 (1분 = 30점, 최대 40점)
    const minutes = this.metrics.timeOnPage / 60;
    score += Math.min(40, Math.floor(minutes * 30));

    // 일반 복사 점수 (1회 = 5점)
    score += this.metrics.copyEvents * 5;

    // 코드 블록 복사 점수 (1회 = 15점) - 높은 가중치
    score += this.metrics.codeBlockCopies * 15;

    this.metrics.score = score;
  }

  private checkThreshold(): void {
    this.calculateScore();

    // 70점 이상이고 아직 콜백 실행 안 했으면
    if (!this.thresholdReached && this.metrics.score >= 70) {
      this.thresholdReached = true;
      console.log(
        '[BoostAD SDK] 70점 도달! 5초 후 2차 광고 요청... (현재:',
        this.metrics.score,
        '점)'
      );

      // 5초 후 콜백 실행 (전부 70점으로만 몰리지 않도록 하기 위해서)
      setTimeout(() => {
        console.log(
          '[BoostAD SDK] 2차 광고 요청 실행 (최종 점수:',
          this.metrics.score,
          '점)'
        );
        if (this.thresholdCallback) {
          this.thresholdCallback();
        }
      }, 5000);
    }
  }
}
