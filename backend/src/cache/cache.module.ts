import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { RedisModule } from 'src/redis/redis.module';
import { CacheRepository } from './repository/cache.repository.interface';
import { RedisCacheRepository } from './repository/redis-cache.repository';
import { RedisTTLWorker } from './redis-ttl.worker';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [LogModule, RedisModule, CampaignModule],
  controllers: [],
  providers: [
    { provide: CacheRepository, useClass: RedisCacheRepository },
    RedisTTLWorker,
  ],
  exports: [CacheRepository],
})
export class CacheModule {}
