/**
 * 태그 타입
 */
export interface Tag {
  id: number;
  name: string;
}

/**
 * 캠페인 기본 타입
 */
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

/**
 * 점수와 설명이 추가된 캠페인 (B가 반환하는 타입)
 */
export interface PlusCampaign extends Campaign {
  explain: string;
  score: number;
}

/**
 * 광고 선정 API 응답 타입 (B → C)
 */
export interface AdSelectionResponse {
  winner: PlusCampaign;
  candidates: PlusCampaign[];
}

/**
 * 블로그 포스트 타입
 */
export interface BlogPost {
  title: string;
  content: string;
  autoTags: Tag[];
}

/**
 * 클릭 로그 타입
 */
export interface ClickLog {
  timestamp: string;
  campaignId: string;
  campaignName: string;
  url: string;
}
