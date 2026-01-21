import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheController } from './cache.controller';
import { LogModule } from 'src/log/log.module';
import { RedisCacheConfig } from 'src/config/redis.config';
import { AuctionStore } from './auction/auction.store.interface';
import { RedisAuctionStore } from './auction/redis-auction.store';

@Module({
  imports: [
    LogModule,
    // TODO: 추후에 app모듈로 위치 변경 예정
    NestCacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisCacheConfig,
    }),
  ],
  controllers: [CacheController],
  providers: [{ provide: AuctionStore, useClass: RedisAuctionStore }],
  exports: [AuctionStore],
})
export class CacheModule {}
