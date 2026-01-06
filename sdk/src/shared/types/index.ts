// SDK 설정 타입 (스크립트 태그의 data-* 속성)
export interface SDKConfig {
  blogId: string;
  apiBase: string;
}

// 태그 타입
export interface Tag {
  id: number;
  name: string;
}

// 광고 캠페인 타입 (순수 캠페인 정보)
export interface Campaign {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  tags: Tag[];
}

// 매칭된 캠페인 (Campaign + 매칭 결과)
export interface MatchedCampaign extends Campaign {
  explain: string;
  score: number;
}

// Decision API 응답 타입
export interface DecisionResponse {
  winner: MatchedCampaign | null;
  candidates: MatchedCampaign[];
}

// 전략 패턴 인터페이스들
export interface TagExtractor {
  extract(): Tag[];
}

export interface APIClient {
  fetchDecision(tags: Tag[], url: string): Promise<DecisionResponse>;
}

export interface AdRenderer {
  render(ad: MatchedCampaign | null, container: HTMLElement): void;
}
