// 키워드별 통계 아이템
export interface KeywordStatItem {
  id: number;
  name: string;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
}

// 키워드 통계 응답
export interface KeywordStatsResponse {
  total: number;
  hasMore: boolean;
  keywords: KeywordStatItem[];
}
