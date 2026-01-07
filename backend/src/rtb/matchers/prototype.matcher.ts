// import { Injectable } from '@nestjs/common';
// import { Matcher } from './matcher.interface';
// import { CampaignRepository } from '../repositories/campaign.repository.interface';
// import type { Candidate, DecisionContext, Tag } from '../types/decision.types';

// @Injectable()
// export class PrototypeMatcher implements Matcher {
//   constructor(private readonly campaignRepo: CampaignRepository) {}

//   async findCandidatesByTags(context: DecisionContext): Promise<Candidate[]> {
//     const tags: Tag[] = context.tags.map((name, idx) => ({
//       id: idx,
//       name,
//     }));

//     // Repository에서 태그 기반 필터링
//     const candidates = await this.campaignRepo.findByTags(tags);

//     return candidates;
//   }
// }
