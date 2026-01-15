import type { CampaignWithTags, Tag } from 'src/campaign/types/campaign.types';

// export interface Campaign {
//   id: string;
//   user_id: number;
//   title: string;
//   content: string;
//   image: string;
//   url: string;
//   tags: Tag[];
//   max_cpc: number;
//   daily_budget: number;
//   total_budget: number | null;
//   is_high_intent: boolean;
//   status: 'ACTIVE' | 'PAUSED' | 'PENDING' | 'ENDED';
//   start_date: string;
//   end_date: string;
//   created_at: string;
//   deleted_at: string | null;
// }
export interface DecisionContext {
  blogKey: string;
  tags: string[];
  postUrl: string;
  behaviorScore: number;
  isHighIntent: boolean;
}

// export interface Tag {
//   id: number;
//   name: string;
// }

export interface Candidate {
  campaign: CampaignWithTags;
  similarity: number;
}

export interface ScoredCandidate extends CampaignWithTags {
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
