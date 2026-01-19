import { Module } from '@nestjs/common';
import { BidLogController } from './bid-log.controller';
import { BidLogService } from './bid-log.service';
import { BidLogRepository } from './repositories/bid-log.repository.interface';
// import { InMemoryBidLogRepository } from './repositories/in-memory-bid-log.repository';
import { TypeOrmBidLogRepository } from './repositories/typeorm-bid-log.repository';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [CampaignModule],
  controllers: [BidLogController],
  providers: [
    BidLogService,
    {
      provide: BidLogRepository,
      useClass: TypeOrmBidLogRepository,
    },
  ],
  exports: [BidLogRepository],
})
export class BidLogModule {}
