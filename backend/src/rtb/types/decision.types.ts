import { Campaign } from 'src/campaign/types/campaign.types';

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

export interface Candidate {
  campaign: Campaign;
  similarity: number;
}

export interface ScoredCandidate extends Campaign {
  score: number;
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
