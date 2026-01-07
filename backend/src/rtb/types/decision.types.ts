export interface DecisionContext {
  blogKey: string;
  tags: string[];
  postUrl: string;
  behaviorScore: number;
  isHighIntent: boolean;
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

export interface Candidate extends Campaign {
  similarity: number;
}

export interface ScoredCandidate extends Campaign {
  score: number;
  matchedTags: Tag[];
}

export interface ScoringResult {
  score: number;
  matchedTags: Tag[];
  breakdown: {
    cpc: number;
    matchCount: number;
    similarity?: number;
    otherBonus?: number;
  };
}

export interface SelectionResult {
  winner: ScoredCandidate;
  candidates: ScoredCandidate[];
}
