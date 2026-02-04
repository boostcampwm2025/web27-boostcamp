import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CampaignCacheRepository } from 'src/campaign/repository/campaign.cache.repository.interface';
import { RedisCampaignCacheRepository } from 'src/campaign/repository/redis-campaign.cache.repository';
import { QueueModule } from 'src/queue/queue.module';
import { EmbeddingWorker } from 'src/queue/workers/embedding.worker';
import { RedisModule } from 'src/redis/redis.module';
import { MLEngine } from 'src/rtb/ml/mlEngine.interface';
import { XenovaMLEngine } from 'src/rtb/ml/xenova-mlEngine';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    RedisModule,
    QueueModule,
  ],
  providers: [
    EmbeddingWorker,
    { provide: MLEngine, useClass: XenovaMLEngine },
    {
      provide: CampaignCacheRepository,
      useClass: RedisCampaignCacheRepository,
    },
  ],
})
export class WorkerModule {}
