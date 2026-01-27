import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { LogModule } from 'src/log/log.module';
import { RedisCacheConfig } from 'src/config/redis.config';
import { RedisModule } from 'src/redis/redis.module';
import { CacheRepository } from './repository/cache.repository.interface';
import { RedisCacheRepository } from './repository/redis-cache.repository';

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
  providers: [{ provide: CacheRepository, useClass: RedisCacheRepository }],
  exports: [CacheRepository],
})
export class CacheModule {}
