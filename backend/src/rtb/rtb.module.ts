// src/rtb/rtb.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { RTBService } from './rtb.service';

// Repository
import { CampaignRepository } from './repositories/campaign.repository.interface';
import { PrototypeCampaignRepository } from './repositories/prototype-campaign.repository';
// import { TypeOrmRTBCampaignRepository } from './repositories/typeorm-rtb-campaign.repository';

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

// BidLog (순환 의존성)
import { BidLogModule } from '../bid-log/bid-log.module';

@Module({
  imports: [CacheModule, forwardRef(() => BidLogModule)],
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
  exports: [RTBService, CampaignRepository],
})
export class RTBModule {}
