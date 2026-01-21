import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AuctionData } from '../types/auction-data.type';
import { CacheRepository } from './cache.repository.interface';

@Injectable()
export class RedisCacheRepository extends CacheRepository {
  private readonly logger = new Logger(RedisCacheRepository.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super();
  }

  async setAuctionData(
    auctionId: string,
    auctionData: AuctionData,
    ttl: number = 24 * 60 * 60 * 1000 // TTL: 24시간 (밀리초 단위)
  ): Promise<void> {
    const key = this.getAuctionKey(auctionId);
    await this.cacheManager.set(key, auctionData, ttl);
  }

  async getAuctionData(auctionId: string): Promise<AuctionData | undefined> {
    const key = this.getAuctionKey(auctionId);
    const data = await this.cacheManager.get<AuctionData>(key);
    return data;
  }

  async deleteAuctionData(auctionId: string): Promise<void> {
    const key = this.getAuctionKey(auctionId);
    await this.cacheManager.del(key);
  }

  // Redis 키 생성 (네임스페이스 추가)
  private getAuctionKey(auctionId: string): string {
    return `auction:${auctionId}`;
  }
}
