# 이번주 작업 계획 - DevAd SDK 행동 추적 & BidLog 구현

## 작업 개요

이번주에 구현할 3가지 주요 기능:

1. **SDK 행동 데이터 수집 및 2차 광고 매칭**
   - 스크롤, 체류시간, 코드복사 추적
   - 점수 70점 도달 시 고의도 광고로 자동 교체

2. **SDK 태그 추출 개선**
   - 티스토리 블로그의 태그 영역에서 태그 추출
   - 기존 h1/h2 추출과 결합하여 정확도 향상

3. **백엔드 BidLog 저장**
   - RTB 경매 참여 기록 저장 (WIN/LOSS)
   - 대시보드 분석용 데이터 제공

---

## 구현 순서 (6일 계획)

### Day 1: 백엔드 기반 구축

**목표**: SDK 요청을 받을 수 있는 백엔드 인프라 구축

#### 1.1 BidLog 타입 정의
**파일**: `backend/src/types/bid-log.ts` (신규)

```typescript
export interface BidLog {
  auction_id: string;      // 경매 고유 ID
  campaign_id: string;     // 참여 캠페인 ID
  blog_id: string;         // 블로그 ID
  status: 'WIN' | 'LOSS';  // 입찰 결과
  bid_price: number;       // 입찰가 (max_price)
  timestamp: string;       // ISO 타임스탬프
}
```

#### 1.2 BidLogRepository 구현
**파일**: `backend/src/rtb/bid-log.repository.ts` (신규)

ClickLogRepository 패턴을 따라 구현:
- 인메모리 배열 저장소
- `save()`, `findRecent()`, `count()`, `findByCampaignId()`, `findByAuctionId()`, `getWinRate()` 메서드

#### 1.3 SDK 전용 컨트롤러 생성
**파일**: `backend/src/rtb/sdk.controller.ts` (신규)

```typescript
@Controller('sdk')
export class SDKController {
  @Post('decision')
  async getDecision(@Body() body: SDKDecisionRequestDto) {
    // blogKey, tags, postUrl, behaviorScore, isHighIntent 받기
    // RTBService 호출
  }
}
```

**중요**: SDK는 `/api/sdk/decision`을 호출하는데, 기존 백엔드는 `/api/b/decision`만 있음. 새 엔드포인트 필요.

#### 1.4 RTBModule 업데이트
**파일**: `backend/src/rtb/rtb.module.ts`

```typescript
@Module({
  controllers: [RTBController, SDKController], // SDKController 추가
  providers: [
    RTBService,
    BidLogRepository, // 추가
    // ... 기존 providers
  ],
})
```

#### 1.5 RTBService에 BidLog 통합
**파일**: `backend/src/rtb/rtb.service.ts`

```typescript
constructor(
  private readonly bidLogRepository: BidLogRepository, // 추가
  // ... 기존 dependencies
) {}

async runAuction(context: DecisionContext) {
  // 기존 경매 로직 실행
  const result = await this.selector.selectWinner(scored);

  // BidLog 저장 추가
  const auctionId = this.generateAuctionId();
  this.saveBidLogs(auctionId, context.postId, result);

  return { winner, candidates };
}

private generateAuctionId(): string {
  return `auction-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

private saveBidLogs(auctionId: string, blogId: string, result: SelectionResult): void {
  const timestamp = new Date().toISOString();

  result.candidates.forEach((candidate) => {
    const bidLog: BidLog = {
      auction_id: auctionId,
      campaign_id: candidate.id,
      blog_id: blogId,
      status: candidate.id === result.winner.id ? 'WIN' : 'LOSS',
      bid_price: candidate.max_price,
      timestamp,
    };

    this.bidLogRepository.save(bidLog);
  });
}
```

**체크포인트**: Postman으로 `/api/sdk/decision` 호출 시 BidLog 저장 확인

---

### Day 2: SDK 태그 추출 개선

**목표**: 티스토리 태그 영역에서 태그 추출 + 기존 h1/h2와 결합

#### 2.1 TagExtractor 개선
**파일**: `sdk/src/features/TagExtractor.ts`

```typescript
export class TagExtractor {
  extract(): Tag[] {
    const headingTags = this.extractFromHeadings();
    const tistoryTags = this.extractFromTistoryTags();

    const allTags = [...headingTags, ...tistoryTags];
    const uniqueTags = this.deduplicateTags(allTags);

    console.log('[DevAd SDK] h1/h2 태그:', headingTags.length);
    console.log('[DevAd SDK] Tistory 태그:', tistoryTags.length);
    console.log('[DevAd SDK] 최종 추출:', uniqueTags.length);

    return uniqueTags;
  }

  private extractFromHeadings(): Tag[] {
    // 기존 로직 (h1, h2에서 추출)
  }

  private extractFromTistoryTags(): Tag[] {
    const TISTORY_TAG_SELECTORS = [
      '.tags a',
      '.tag-list a',
      'a[rel="tag"]',
      '.entry-tags a',
    ];

    const tagTexts = new Set<string>();

    for (const selector of TISTORY_TAG_SELECTORS) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(el => {
          const text = el.textContent?.trim().toLowerCase();
          if (text) tagTexts.add(text);
        });
        break;
      }
    }

    return this.tags.filter(tag =>
      tagTexts.has(tag.name.toLowerCase())
    );
  }

  private deduplicateTags(tags: Tag[]): Tag[] {
    const uniqueMap = new Map<number, Tag>();
    tags.forEach(tag => uniqueMap.set(tag.id, tag));
    return Array.from(uniqueMap.values());
  }
}
```

#### 2.2 테스트 HTML 업데이트
**파일**: `test-external-blog.html`

티스토리 스타일 태그 영역 추가:

```html
<div class="tags" style="margin: 20px 0;">
  <a href="#">TypeScript</a>
  <a href="#">NestJS</a>
  <a href="#">Backend</a>
</div>
```

**체크포인트**: 콘솔에서 h1/h2 태그와 Tistory 태그 개수 확인

---

### Day 3-4: SDK 행동 추적 시스템

**목표**: 사용자 행동 데이터 수집 및 점수 계산

#### 3.1 BehaviorTracker 인터페이스 추가
**파일**: `sdk/src/shared/types/index.ts`

```typescript
export interface BehaviorTracker {
  start(): void;
  stop(): void;
  getCurrentScore(): number;
  isHighIntent(): boolean;
  onThresholdReached(callback: () => void): void;
}

export interface BehaviorMetrics {
  scrollDepth: number;      // 0-100%
  timeOnPage: number;       // seconds
  copyEvents: number;       // count
  score: number;            // calculated total
}
```

#### 3.2 BehaviorTracker 구현
**파일**: `sdk/src/features/BehaviorTracker.ts` (신규)

**점수 계산 공식**:
- 스크롤 50% 이상: +20점
- 스크롤 80% 이상: +10점 추가 (총 30점)
- 체류 시간: 1분당 30점 (최대 40점)
- 코드 복사: 1회당 +5점

**임계값**: 70점 이상 → `isHighIntent = true`

```typescript
export class BehaviorTracker {
  private metrics = {
    scrollDepth: 0,
    timeOnPage: 0,
    copyEvents: 0,
    score: 0
  };

  private thresholdReached = false;
  private thresholdCallback: (() => void) | null = null;

  start(): void {
    this.startTime = Date.now();
    window.addEventListener('scroll', this.handleScroll);
    document.addEventListener('copy', this.handleCopy);
    this.startTimer();
  }

  private handleScroll = (): void => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    this.metrics.scrollDepth = Math.min(100, scrollPercent);
    this.checkThreshold();
  };

  private handleCopy = (): void => {
    this.metrics.copyEvents++;
    this.checkThreshold();
  };

  private startTimer(): void {
    setInterval(() => {
      this.metrics.timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
      this.checkThreshold();
    }, 1000);
  }

  private calculateScore(): void {
    let score = 0;

    // 스크롤
    if (this.metrics.scrollDepth >= 80) score += 30;
    else if (this.metrics.scrollDepth >= 50) score += 20;

    // 체류시간
    const minutes = this.metrics.timeOnPage / 60;
    score += Math.min(40, Math.floor(minutes * 30));

    // 복사
    score += this.metrics.copyEvents * 5;

    this.metrics.score = score;
  }

  private checkThreshold(): void {
    this.calculateScore();

    if (!this.thresholdReached && this.metrics.score >= 70) {
      this.thresholdReached = true;
      console.log('[DevAd SDK] 70점 도달! Score:', this.metrics.score);

      if (this.thresholdCallback) {
        this.thresholdCallback();
      }
    }
  }
}
```

#### 3.3 DecisionAPIClient 업데이트
**파일**: `sdk/src/features/DecisionAPIClient.ts`

메서드 시그니처 변경:

```typescript
async fetchDecision(
  tags: Tag[],
  url: string,
  behaviorScore: number = 0,
  isHighIntent: boolean = false
): Promise<DecisionResponse> {
  const requestBody = {
    blogKey: this.config.blogId,
    tags: tags.map((tag) => tag.name),
    postUrl: url,
    behaviorScore,    // 동적 값
    isHighIntent,     // 동적 값
  };
  // ... 기존 fetch 로직
}
```

**APIClient 인터페이스도 업데이트**:

```typescript
export interface APIClient {
  fetchDecision(
    tags: Tag[],
    url: string,
    behaviorScore?: number,
    isHighIntent?: boolean
  ): Promise<DecisionResponse>;
}
```

**체크포인트**: 콘솔에서 스크롤/복사/시간 이벤트 발생 시 점수 증가 확인

---

### Day 5: SDK 통합

**목표**: BehaviorTracker를 DevAdSDK에 통합하여 2차 광고 요청

#### 5.1 DevAdSDK 업데이트
**파일**: `sdk/src/features/DevAdSDK.ts`

```typescript
export class DevAdSDK {
  private hasRequestedSecondAd = false;

  constructor(
    public tagExtractor: TagExtractor,
    public apiClient: APIClient,
    public adRenderer: AdRenderer,
    public behaviorTracker: BehaviorTracker  // 추가
  ) {}

  async init(): Promise<void> {
    const zones = document.querySelectorAll('[data-devad-zone]');
    const tags = this.tagExtractor.extract();
    const url = window.location.href;

    // 1차 광고 요청 (behaviorScore=0, isHighIntent=false)
    zones.forEach(async (zone) => {
      const data = await this.apiClient.fetchDecision(tags, url, 0, false);
      this.adRenderer.render(data.winner, zone as HTMLElement);
    });

    // 행동 추적 시작
    this.behaviorTracker.onThresholdReached(() => {
      this.requestSecondAd(tags, url, zones);
    });
    this.behaviorTracker.start();
  }

  private async requestSecondAd(tags: Tag[], url: string, zones: NodeListOf<Element>): Promise<void> {
    if (this.hasRequestedSecondAd) {
      console.log('[DevAd SDK] 2차 광고 이미 요청됨, 스킵');
      return;
    }

    this.hasRequestedSecondAd = true;

    const score = this.behaviorTracker.getCurrentScore();
    const isHighIntent = this.behaviorTracker.isHighIntent();

    console.log('[DevAd SDK] 2차 광고 요청 - Score:', score, 'HighIntent:', isHighIntent);

    // 2차 광고 요청 (실제 behaviorScore, isHighIntent=true)
    zones.forEach(async (zone) => {
      const data = await this.apiClient.fetchDecision(tags, url, score, isHighIntent);
      this.adRenderer.render(data.winner, zone as HTMLElement);
    });
  }
}
```

#### 5.2 index.ts 업데이트
**파일**: `sdk/src/index.ts`

```typescript
import { BehaviorTracker } from './features/BehaviorTracker'; // 추가

const behaviorTracker = new BehaviorTracker(); // 추가
const sdk = new DevAdSDK(
  tagExtractor,
  apiClient,
  adRenderer,
  behaviorTracker  // 추가
);
```

**체크포인트**:
- 1차 API 호출 확인 (behaviorScore=0)
- 70점 도달 시 2차 API 호출 확인 (behaviorScore=70+, isHighIntent=true)
- 광고 DOM 업데이트 확인

---

### Day 6: 테스트 & 검증

**목표**: 전체 기능 E2E 테스트

#### 6.1 태그 추출 테스트
1. `test-external-blog.html` 열기
2. 콘솔에서 h1/h2 태그 개수 확인
3. 콘솔에서 Tistory 태그 개수 확인
4. 네트워크 탭에서 `/api/sdk/decision` POST 요청의 tags 배열 확인

#### 6.2 행동 추적 테스트
1. **스크롤 테스트**: 50%, 80% 스크롤 시 점수 증가 확인
2. **시간 테스트**: 60초 대기 시 30점 추가 확인
3. **복사 테스트**: 텍스트 복사(Cmd+C) 시 5점 추가 확인
4. **70점 도달 테스트**:
   - 스크롤 80% (30점) + 90초 대기 (45점) = 75점
   - 콘솔에 "70점 도달!" 로그 확인
   - 네트워크에 2차 API 요청 확인

#### 6.3 2차 API 호출 테스트
1. 네트워크 탭에서 2개의 `/api/sdk/decision` POST 확인
2. **1차 요청**: `{behaviorScore: 0, isHighIntent: false}`
3. **2차 요청**: `{behaviorScore: 75, isHighIntent: true}`
4. 광고 DOM이 새로운 광고로 교체되었는지 확인
5. 3차 요청이 발생하지 않는지 확인 (hasRequestedSecondAd 플래그)

#### 6.4 BidLog 저장 테스트
1. 백엔드 콘솔에서 "BidLogs saved" 로그 확인
2. `/api/b/debug/bidlogs` 엔드포인트로 저장된 로그 확인 (선택사항)
3. 각 경매마다 3-5개의 BidLog 생성 확인
4. 정확히 1개만 `status: "WIN"` 확인
5. 같은 경매의 모든 로그가 동일한 `auction_id` 확인

#### 6.5 엣지 케이스 테스트
- 태그가 하나도 없는 경우
- 네트워크 오류 발생 시
- 페이지 이탈 후 재진입
- 여러 광고 존(zone) 동시 렌더링

---

## 핵심 파일 목록

### SDK (7개 파일)

1. ✅ `sdk/src/features/TagExtractor.ts` - 티스토리 태그 추출 추가
2. ✨ `sdk/src/features/BehaviorTracker.ts` - 신규 파일, 행동 추적
3. ✅ `sdk/src/features/DevAdSDK.ts` - BehaviorTracker 통합, 2차 API 호출
4. ✅ `sdk/src/features/DecisionAPIClient.ts` - behaviorScore/isHighIntent 파라미터 추가
5. ✅ `sdk/src/shared/types/index.ts` - BehaviorTracker 인터페이스 추가
6. ✅ `sdk/src/index.ts` - BehaviorTracker 생성 및 주입
7. ✅ `test-external-blog.html` - 티스토리 태그 HTML 추가

### Backend (5개 파일, 2개 신규)

8. ✨ `backend/src/types/bid-log.ts` - 신규 파일, BidLog 타입
9. ✨ `backend/src/rtb/bid-log.repository.ts` - 신규 파일, 인메모리 저장소
10. ✅ `backend/src/rtb/rtb.service.ts` - BidLog 저장 로직 추가
11. ✅ `backend/src/rtb/rtb.module.ts` - BidLogRepository, SDKController 등록
12. ✨ `backend/src/rtb/sdk.controller.ts` - 신규 파일, `/api/sdk/decision` 엔드포인트

---

## 주요 기술 결정

### 1. 점수 계산 공식
- **스크롤**: 50%+ = 20점, 80%+ = 30점
- **시간**: 1분 = 30점 (최대 40점)
- **복사**: 1회 = 5점
- **임계값**: 70점 이상 → 고의도 사용자

### 2. 2차 API 호출 시점
- 점수 70점 도달 시 **즉시** 호출
- `hasRequestedSecondAd` 플래그로 중복 방지

### 3. BidLog 저장 데이터
- auction_id, campaign_id, blog_id (기본)
- status (WIN/LOSS), bid_price (입찰가)
- timestamp (ISO 형식)

### 4. 태그 추출 전략
- h1/h2 태그 + 티스토리 태그 영역 모두 사용
- 중복 제거 후 반환

---

## 병렬 작업 가능 구간

- **Day 1 (백엔드)** + **Day 2 (태그)**: 독립적으로 진행 가능
- **Day 3-4 (행동 추적)**: Day 1 완료 후 시작 가능
- **Day 5 (통합)**: Day 1-4 모두 완료 후 진행
- **Day 6 (테스트)**: 전체 완료 후 검증

---

## 성공 기준

✅ SDK가 티스토리 태그와 h1/h2에서 태그 추출
✅ 사용자 행동 데이터 수집 및 점수 계산
✅ 70점 도달 시 자동으로 2차 광고 요청
✅ 백엔드가 모든 경매에 BidLog 저장
✅ WIN/LOSS 상태 정확히 기록
✅ 네트워크 탭에서 2개의 Decision API 호출 확인

---

## 참고 사항

- ViewLog는 다른 팀원이 SDK 모듈로 구현 (렌더링 확인 후 저장)
- BidLog는 백엔드에서 경매 직후 저장 (실제 렌더링 무관)
- 현재는 인메모리 저장, 추후 DB 마이그레이션 예정
- behaviorScore/isHighIntent는 향후 RTB 엔진 개선에 활용
