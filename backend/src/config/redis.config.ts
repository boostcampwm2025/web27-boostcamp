import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Injectable()
export class RedisCacheConfig implements CacheOptionsFactory {
  private readonly logger = new Logger(RedisCacheConfig.name);

  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.logger.log(`🔄 Redis 연결 시도: redis://${host}:${port}`);

    return {
      stores: [new KeyvRedis(`redis://${host}:${port}`)],
    };
  }
}
