import { Inject, Injectable } from '@nestjs/common';
import { AuctionData } from '../types/auction-data.type';
import { CacheRepository } from './cache.repository.interface';
import { StoredOAuthState } from '../../auth/auth.service';
import crypto from 'crypto';
import { IOREDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppIORedisClient } from 'src/redis/redis.type';

@Injectable()
export class RedisCacheRepository extends CacheRepository {
  constructor(
    @Inject(IOREDIS_CLIENT) private readonly redis: AppIORedisClient
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
    const value = JSON.stringify(auctionData);
    const ttlSeconds = Math.floor(ttl / 1000);
    await this.redis.setex(key, ttlSeconds, value);
  }

  async getAuctionData(auctionId: string): Promise<AuctionData | undefined> {
    const key = this.getAuctionKey(auctionId);
    const value = await this.redis.get(key);
    if (!value) return undefined;
    return JSON.parse(value) as AuctionData;
  }

  async deleteAuctionData(auctionId: string): Promise<void> {
    const key = this.getAuctionKey(auctionId);
    await this.redis.del(key);
  }

  // OAuth State 관련 메서드
  async setOAuthState(
    state: string,
    data: StoredOAuthState,
    ttl: number
  ): Promise<void> {
    const key = this.getOAuthStateKey(state);
    const value = JSON.stringify(data);
    const ttlSeconds = Math.floor(ttl / 1000);
    await this.redis.setex(key, ttlSeconds, value);
  }

  async getOAuthState(state: string): Promise<StoredOAuthState | undefined> {
    const key = this.getOAuthStateKey(state);
    const value = await this.redis.get(key);
    if (!value) return undefined;
    return JSON.parse(value) as StoredOAuthState;
  }

  async deleteOAuthState(state: string): Promise<void> {
    const key = this.getOAuthStateKey(state);
    await this.redis.del(key);
  }

  async setViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean,
    viewId: number,
    ttlMs: number = 60 * 30 * 1000
  ): Promise<void> {
    const hashedUrl = this.hashUrl(postUrl);
    const intent = isHighIntent ? 'high' : 'normal';
    const key = `dedup:view:${intent}:post:${hashedUrl}:visitor:${visitorId}`;
    await this.redis.set(key, String(viewId), 'PX', ttlMs);
  }

  async acquireViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean,
    ttlMs: number = 60 * 30 * 1000
  ): Promise<
    | { status: 'acquired' }
    | { status: 'exists'; viewId: number }
    | { status: 'locked' }
  > {
    const hashedUrl = this.hashUrl(postUrl);
    const intent = isHighIntent ? 'high' : 'normal';
    const key = `dedup:view:${intent}:post:${hashedUrl}:visitor:${visitorId}`;

    // SET key "LOCK" PX ttlMs NX
    const result = await this.redis.set(key, 'LOCK', 'PX', ttlMs, 'NX');

    if (result === 'OK') {
      return { status: 'acquired' };
    }

    const existingValue = await this.redis.get(key);
    if (!existingValue) return { status: 'locked' };

    const existingViewId = Number(existingValue);
    if (Number.isNaN(existingViewId)) return { status: 'locked' };

    return { status: 'exists', viewId: existingViewId };
  }

  async getViewIdByIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean
  ): Promise<number | null> {
    const hashedUrl = this.hashUrl(postUrl);
    const intent = isHighIntent ? 'high' : 'normal';
    const key = `dedup:view:${intent}:post:${hashedUrl}:visitor:${visitorId}`;

    const value = await this.redis.get(key);
    if (!value) return null;

    const viewId = Number(value);
    if (Number.isNaN(viewId)) return null;

    return viewId;
  }

  // 이미 있는 값이면 true, 최초면 false return
  async setClickIdempotencyKey(
    viewId: number,
    ttlMs: number = 60 * 30 * 1000
  ): Promise<boolean> {
    const key = `dedup:click:view:${viewId}`;

    // SET key "1" PX ttlMs NX
    const result = await this.redis.set(key, '1', 'PX', ttlMs, 'NX');

    if (result === 'OK') {
      return false; // 최초 설정
    }

    const existingValue = await this.redis.get(key);
    if (!existingValue) return false;

    return true; // 이미 존재
  }

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
