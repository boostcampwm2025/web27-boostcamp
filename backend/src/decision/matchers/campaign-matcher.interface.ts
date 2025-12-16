import type { Campaign, DecisionContext } from '../types/decision.types';

export abstract class CampaignMatcher {
  abstract findCandidatesByTags(context: DecisionContext): Promise<Campaign[]>;
}
