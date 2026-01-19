export interface KeywordStats {
  id: number;
  name: string;
  avgImpressions: number;
  avgClicks: number;
  avgCtr: number;
}

export type SortKey = 'avgClicks' | 'avgImpressions' | 'avgCtr';

export type KeywordStatsResponse = KeywordStats[];
