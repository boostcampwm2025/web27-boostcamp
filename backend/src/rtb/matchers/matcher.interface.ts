import type { Campaign, DecisionContext } from '../types/decision.types';

export abstract class Matcher {
  abstract findCandidatesByTags(context: DecisionContext): Promise<Campaign[]>;
}
