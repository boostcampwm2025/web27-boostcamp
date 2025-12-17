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

// 광고 캠페인 타입
export interface Campaign {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  tags: Tag[];
  min_price: number;
  max_price: number;
}

// Decision API 응답 타입
export interface DecisionResponse {
  winner: Campaign | null;
  explainText: string;
  score: number;
}

// 전략 패턴 인터페이스들
export interface TagExtractor {
  extract(): string[];
}

export interface APIClient {
  fetchDecision(tags: string[]): Promise<DecisionResponse>;
}

export interface AdRenderer {
  render(ad: Campaign | null, container: HTMLElement): void;
}
