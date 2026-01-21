import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AuctionData } from '../types/auction-data.type';
import { AuctionStore } from './auction.store';

@Injectable()
export class RedisAuctionStore extends AuctionStore {
  private readonly logger = new Logger(RedisAuctionStore.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super();
  }

  async set(
    auctionId: string,
    auctionData: AuctionData,
    ttl: number = 24 * 60 * 60 * 1000 // TTL: 24시간 (밀리초 단위)
  ): Promise<void> {
    const key = this.getKey(auctionId);
    await this.cacheManager.set(key, auctionData, ttl);
  }

  async get(auctionId: string): Promise<AuctionData | undefined> {
    const key = this.getKey(auctionId);
    const data = await this.cacheManager.get<AuctionData>(key);
    return data;
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
