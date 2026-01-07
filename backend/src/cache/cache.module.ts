import { Module } from '@nestjs/common';
import { AuctionStore } from './auction/auction.store';
import { InMemoryAuctionStore } from './auction/in-memory-auction.store';

@Module({
  providers: [{ provide: AuctionStore, useClass: InMemoryAuctionStore }],
  exports: [AuctionStore],
})
export class CacheModule {}
