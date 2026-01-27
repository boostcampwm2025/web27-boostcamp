import { AuctionData } from '../types/auction-data.type';
import { StoredOAuthState } from '../../auth/auth.service';

export abstract class CacheRepository {
  // Auction 관련 메서드
  abstract setAuctionData(
    auctionId: string,
    auctionData: AuctionData,
    ttl?: number
  ): Promise<void>;
  abstract getAuctionData(auctionId: string): Promise<AuctionData | undefined>;
  abstract deleteAuctionData(auctionId: string): Promise<void>;

  // OAuth State 관련 메서드
  abstract setOAuthState(
    state: string,
    data: StoredOAuthState,
    ttl: number
  ): Promise<void>;
  abstract getOAuthState(state: string): Promise<StoredOAuthState | undefined>;
  abstract deleteOAuthState(state: string): Promise<void>;

  abstract acquireViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean,
    ttlMs?: number
  ): Promise<
    | { status: 'acquired' }
    | { status: 'exists'; viewId: number }
    | { status: 'locked' }
  >;

  abstract setViewIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean,
    viewId: number,
    ttlMs?: number
  ): Promise<void>;

  abstract getViewIdByIdempotencyKey(
    postUrl: string,
    visitorId: string,
    isHighIntent: boolean
  ): Promise<number | null>;

  abstract setClickIdempotencyKey(
    viewId: number,
    ttlMs?: number
  ): Promise<boolean>;
}
