import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AuctionData } from '../types/auction-data.type';
import { AuctionStore } from './auction.store';

@Injectable()
export class RedisAuctionStore extends AuctionStore {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super();
  }

  async set(auctionId: string, auctionData: AuctionData): Promise<void> {
    const key = this.getKey(auctionId);
    await this.cacheManager.set(key, auctionData);
  }

  async get(auctionId: string): Promise<AuctionData | undefined> {
    const key = this.getKey(auctionId);
    return await this.cacheManager.get<AuctionData>(key);
  }

  async delete(auctionId: string): Promise<void> {
    const key = this.getKey(auctionId);
    await this.cacheManager.del(key);
  }

  // Redis 키 생성 (네임스페이스 추가)
  private getKey(auctionId: string): string {
    return `auction:${auctionId}`;
  }
}
