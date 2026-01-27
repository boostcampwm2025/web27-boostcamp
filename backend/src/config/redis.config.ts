import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';
import { REDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppRedisClient } from 'src/redis/redis.type';

@Injectable()
export class RedisCacheConfig implements CacheOptionsFactory {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: AppRedisClient
  ) {}

  createCacheOptions(): CacheModuleOptions {
    return {
      stores: [new KeyvRedis(this.redisClient)],
    };
  }
}
