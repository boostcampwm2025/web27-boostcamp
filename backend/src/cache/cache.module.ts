import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { LogModule } from 'src/log/log.module';
import { RedisModule, REDIS_CLIENT } from 'src/redis/redis.module';
import { CacheRepository } from './repository/cache.repository.interface';
import { RedisCacheRepository } from './repository/redis-cache.repository';
import Redis from 'ioredis';
import { CampaignCacheService } from './services/campaign-cache.service';
import { BlogCacheService } from './services/blog-cache.service';
import { RedisIndexService } from './services/redis-index.service';

@Module({
  imports: [
    LogModule,
    RedisModule,
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [RedisModule],
      useFactory: async (redisClient: Redis) => {
        return {
          store: await import('cache-manager-ioredis').then(
            (m) => m.default || m
          ),
          redisInstance: redisClient,
          ttl: 5, // 기본 TTL 5초 (cache-manager-ioredis는 초 단위 사용)
        };
      },
      inject: [REDIS_CLIENT],
    }),
  ],
  controllers: [],
  providers: [
    { provide: CacheRepository, useClass: RedisCacheRepository },
    CampaignCacheService,
    BlogCacheService,
    RedisIndexService,
  ],
  exports: [CacheRepository, CampaignCacheService, BlogCacheService],
})
export class CacheModule {}
