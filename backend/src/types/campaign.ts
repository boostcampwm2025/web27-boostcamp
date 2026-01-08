import { Tag } from './tag';

export interface Campaign {
  id: string;
  title: string;
  content: string;
  image: string;
  url: string;
  tags: Tag[];
  min_price: number;
  max_price: number;
  is_high_intent?: boolean; // 고의도 사용자 타겟팅 여부
  status?: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'ENDED';
}

export interface MatchedCampaign extends Campaign {
  explain: string;
  score: number;
}

export interface AdSelectionResponse {
  winner: MatchedCampaign;
  candidates: MatchedCampaign[];
}
