import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { AuctionData } from '../types/auction-data.type';
import { CacheRepository } from './cache.repository.interface';
import { StoredOAuthState } from '../../auth/auth.service';
import crypto from 'crypto';
import { REDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppRedisClient } from 'src/redis/redis.type';

@Injectable()
export class RedisCacheRepository extends CacheRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REDIS_CLIENT) private readonly redisClient: AppRedisClient
  ) {
    super();
  }

  // Auction 관련 메서드
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

  // OAuth State 관련 메서드
  async setOAuthState(
    state: string,
    data: StoredOAuthState,
    ttl: number
  ): Promise<void> {
    const key = this.getOAuthStateKey(state);
    await this.cacheManager.set(key, data, ttl);
  }

  async getOAuthState(state: string): Promise<StoredOAuthState | undefined> {
    const key = this.getOAuthStateKey(state);
    const data = await this.cacheManager.get<StoredOAuthState>(key);
    return data;
  }

  async deleteOAuthState(state: string): Promise<void> {
    const key = this.getOAuthStateKey(state);
    await this.cacheManager.del(key);
  }

  async setViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    viewId: number,
    ttlMs: number = 60 * 30 * 1000
  ): Promise<void> {
    const hashedUrl = this.hashUrl(postUrl);
    const key = `dedup:view:post:${hashedUrl}:visitor:${visitorId}`;
    await this.redisClient.set(key, viewId, {
      expiration: { type: 'PX', value: ttlMs },
    });
  }

  async acquireViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    ttlMs: number = 60 * 30 * 1000
  ): Promise<
    | { status: 'acquired' }
    | { status: 'exists'; viewId: number }
    | { status: 'locked' }
  > {
    const hashedUrl = this.hashUrl(postUrl);
    const key = `dedup:view:post:${hashedUrl}:visitor:${visitorId}`;

    const result = await this.redisClient.set(key, 'LOCK', {
      expiration: { type: 'PX', value: ttlMs },
      condition: 'NX',
    });

    if (result === 'OK') {
      return { status: 'acquired' };
    }

    const existingValue = await this.redisClient.get(key);
    if (!existingValue) return { status: 'locked' };

    const existingViewId = Number(existingValue);
    if (Number.isNaN(existingViewId)) return { status: 'locked' };

    return { status: 'exists', viewId: existingViewId };
  }

  async getViewIdByIdempotencyKey(
    postUrl: string,
    visitorId: string
  ): Promise<number | null> {
    const hashedUrl = this.hashUrl(postUrl);
    const key = `dedup:view:post:${hashedUrl}:visitor:${visitorId}`;

    const value = await this.redisClient.get(key);
    if (!value) return null;

    const viewId = Number(value);
    if (Number.isNaN(viewId)) return null;

    return viewId;
  }

  // async setClickIdempotencyKey()

  private getAuctionKey(auctionId: string): string {
    return `auction:${auctionId}`;
  }

  private getOAuthStateKey(state: string): string {
    return `oauth:state:${state}`;
  }

  private hashUrl(url: string) {
    return crypto.createHash('sha256').update(url).digest('base64url');
  }
}
