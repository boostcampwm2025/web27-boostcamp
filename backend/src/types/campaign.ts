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
}

export interface MatchedCampaign extends Campaign {
  explain: string;
  score: number;
}

export interface AdSelectionResponse {
  winner: MatchedCampaign;
  candidates: MatchedCampaign[];
}
