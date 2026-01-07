import { Module } from '@nestjs/common';
import { AuctionStore } from './auction/auction.store';
import { InMemoryAuctionStore } from './auction/in-memory-auction.store';
import { CacheController } from './cache.controller';

@Module({
  controllers: [CacheController],
  providers: [{ provide: AuctionStore, useClass: InMemoryAuctionStore }],
  exports: [AuctionStore],
})
export class CacheModule {}
