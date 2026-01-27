import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { RedisModule } from 'src/redis/redis.module';
import { CacheRepository } from './repository/cache.repository.interface';
import { RedisCacheRepository } from './repository/redis-cache.repository';

@Module({
  imports: [LogModule, RedisModule],
  controllers: [],
  providers: [{ provide: CacheRepository, useClass: RedisCacheRepository }],
  exports: [CacheRepository],
})
export class CacheModule {}
