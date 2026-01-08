import { Module, forwardRef } from '@nestjs/common';
import { BidLogController } from './bid-log.controller';
import { BidLogService } from './bid-log.service';
import { BidLogRepository } from './repositories/bid-log.repository';
import { InMemoryBidLogRepository } from './repositories/in-memory-bid-log.repository';
import { RTBModule } from '../rtb/rtb.module';

@Module({
  imports: [forwardRef(() => RTBModule)], // 순환 의존성 해결
  controllers: [BidLogController],
  providers: [
    BidLogService,
    {
      provide: BidLogRepository,
      useClass: InMemoryBidLogRepository,
    },
  ],
  exports: [BidLogRepository],
})
export class BidLogModule {}
