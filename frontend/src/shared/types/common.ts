export interface Tag {
  id: number;
  name: string;
}

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

export interface BlogPost {
  title: string;
  content: string;
  autoTags: Tag[];
}

export interface ClickLog {
  timestamp: string;
  campaignId: string;
  campaignName: string;
  url: string;
}
