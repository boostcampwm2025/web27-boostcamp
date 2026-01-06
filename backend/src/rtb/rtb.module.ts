// src/rtb/rtb.module.ts

import { Module } from '@nestjs/common';
import { RTBService } from './rtb.service';

// Repository
import { CampaignRepository } from './repositories/campaign.repository.interface';
import { PrototypeCampaignRepository } from './repositories/prototype-campaign.repository';

// Matcher
import { Matcher } from './matchers/matcher.interface';
import { PrototypeMatcher } from './matchers/prototype.matcher';

// Scorer
import { Scorer } from './scorers/scorer.interface';
import { PrototypeScorer } from './scorers/prototype.scorer';

// Selector
import { CampaignSelector } from './selectors/selector.interface';
import { PrototypeCampaignSelector } from './selectors/prototype.selector';

// controller
import { RTBController } from './rtb.controller';

@Module({
  controllers: [RTBController],
  providers: [
    RTBService,

    // Repository
    {
      provide: CampaignRepository,
      useClass: PrototypeCampaignRepository,
    },

    // Matcher
    {
      provide: Matcher,
      useClass: PrototypeMatcher,
    },

    // Scorer
    {
      provide: Scorer,
      useClass: PrototypeScorer,
    },

    // Selector
    {
      provide: CampaignSelector,
      useClass: PrototypeCampaignSelector,
    },
  ],
  exports: [RTBService],
})
export class RTBModule {}
