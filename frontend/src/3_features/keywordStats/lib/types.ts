export interface KeywordStats {
  id: number;
  name: string;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
}

export type SortBy = 'avgCtr' | 'totalImpressions' | 'totalClicks';

export interface KeywordStatsResponse {
  total: number;
  hasMore: boolean;
  keywords: KeywordStats[];
}
