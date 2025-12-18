export interface DecisionContext {
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

export interface ScoringResult {
  score: number;
  breakdown: {
    cpc: number;
    matchCount: number;
    otherBonus: number;
  };
}

export interface SelectionResult {
  winner: ScoredCandidate;
  candidates: ScoredCandidate[];
}
