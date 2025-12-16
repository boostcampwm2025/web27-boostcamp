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
  status?: 'active' | 'inactive';
}

export interface ScoredCandidate extends Campaign {
  score: number;
  matchedTags: Tag[];
}
