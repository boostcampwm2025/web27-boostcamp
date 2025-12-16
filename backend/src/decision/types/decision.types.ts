export interface DecisionContext {
  sdkId: string;
  postId: string;
  tags: string[];
  postURL: string;
  zoneId?: string; // 혹시 모르니깐 넣어둠
}

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
  status?: 'active' | 'inactive'; // 혹시 모르니깐 넣어둠
}

export interface ScoredCandidate extends Campaign {
  score: number;
  matchedTags: Tag[];
}
