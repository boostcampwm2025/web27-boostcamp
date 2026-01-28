import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidLogController } from './bid-log.controller';
import { BidLogService } from './bid-log.service';
import { BidLogRepository } from './repositories/bid-log.repository.interface';
// import { InMemoryBidLogRepository } from './repositories/in-memory-bid-log.repository';
import { TypeOrmBidLogRepository } from './repositories/typeorm-bid-log.repository';
import { BidLogEntity } from './entities/bid-log.entity';
import { CampaignModule } from 'src/campaign/campaign.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BidLogEntity]),
    // EventEmitterModule은 AppModule에서 전역 등록됨
    CampaignModule,
    BlogModule,
  ],
  controllers: [BidLogController],
  providers: [
    BidLogService,
    {
      provide: BidLogRepository,
      useClass: TypeOrmBidLogRepository,
    },
  ],
  exports: [BidLogRepository, BidLogService],
})
export class BidLogModule {}
