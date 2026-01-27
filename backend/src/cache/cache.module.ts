import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { LogModule } from 'src/log/log.module';
import { RedisModule, REDIS_CLIENT } from 'src/redis/redis.module';
import { RedisCacheConfig } from 'src/config/redis.config';
import { RedisModule } from 'src/redis/redis.module';
import { CacheRepository } from './repository/cache.repository.interface';
import { RedisCacheRepository } from './repository/redis-cache.repository';
import Redis from 'ioredis';
import { BlogCacheService } from './services/blog-cache.service';
import { RedisIndexService } from './services/redis-index.service';

// TODO: 맞는 방식이었는지 점검 필요
// eslint검증 피하기 위한 cache-manager-ioredis 타입 정의
type RedisStoreModule = {
  default?: unknown;
  [key: string]: unknown;
};

@Module({
  imports: [
    LogModule,
    RedisModule,
    // TODO(후순위): 추후에 app모듈로 위치 변경 예정
    NestCacheModule.registerAsync({
      isGlobal: true,
      imports: [RedisModule],
      useClass: RedisCacheConfig,
    }),
  ],
  controllers: [],
  providers: [
    { provide: CacheRepository, useClass: RedisCacheRepository },
    BlogCacheService,
    RedisIndexService,
  ],
  exports: [CacheRepository, BlogCacheService],
})
export class CacheModule {}
