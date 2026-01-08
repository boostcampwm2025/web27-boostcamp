// src/rtb/rtb.module.ts

import { Module } from '@nestjs/common';
import { RTBService } from './rtb.service';

// Repository
import { CampaignRepository } from './repositories/campaign.repository.interface';
import { PrototypeCampaignRepository } from './repositories/prototype-campaign.repository';
import { BidLogRepository } from './repositories/bid-log.repository';
import { InMemoryBidLogRepository } from './repositories/in-memory-bid-log.repository';

// MLEngine
import { MLEngine } from './ml/mlEngine.interface';
import { XenovaMLEngine } from './ml/xenova-mlEngine';

// Matcher
import { Matcher } from './matchers/matcher.interface';
// import { PrototypeMatcher } from './matchers/prototype.matcher';
import { TransformerMatcher } from './matchers/xenova.matcher';

// Scorer
import { Scorer } from './scorers/scorer.interface';
// import { PrototypeScorer } from './scorers/prototype.scorer';
import { TransformerScorer } from './scorers/xenova.scorer';

// Selector
import { CampaignSelector } from './selectors/selector.interface';
import { PrototypeCampaignSelector } from './selectors/prototype.selector';

// controller
import { RTBController } from './rtb.controller';

// Cache (AuctionStore 사용을 위해)
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [RTBController],
  providers: [
    RTBService,

    // Repository
    {
      provide: CampaignRepository,
      useClass: PrototypeCampaignRepository,
    },
    {
      provide: BidLogRepository,
      useClass: InMemoryBidLogRepository,
    },

    // Matcher
    {
      provide: Matcher,
      useClass: TransformerMatcher,
    },

    // Scorer
    {
      provide: Scorer,
      useClass: TransformerScorer,
    },

    // Selector
    {
      provide: CampaignSelector,
      useClass: PrototypeCampaignSelector,
    },

    // MLEngine,
    {
      provide: MLEngine,
      useClass: XenovaMLEngine,
    },
  ],
  exports: [RTBService],
})
export class RTBModule {}
