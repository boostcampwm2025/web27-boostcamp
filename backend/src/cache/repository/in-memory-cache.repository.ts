import { AuctionData } from '../types/auction-data.type';
import { CacheRepository } from './cache.repository.interface';
import { Logger } from '@nestjs/common';

export class InMemoryCacheRepository extends CacheRepository {
  private readonly auctionDataMap = new Map<string, AuctionData>();
  private readonly oauthStateMap = new Map<
    string,
    import('../../auth/auth.service').StoredOAuthState
  >();

  setAuctionData(auctionId: string, auctionData: AuctionData): Promise<void> {
    this.auctionDataMap.set(auctionId, auctionData);
    return Promise.resolve();
  }

  getAuctionData(auctionId: string): Promise<AuctionData | undefined> {
    return Promise.resolve(this.auctionDataMap.get(auctionId));
  }

  deleteAuctionData(auctionId: string): Promise<void> {
    this.auctionDataMap.delete(auctionId);
    return Promise.resolve();
  }

  // OAuth State 관련 메서드 (In-Memory 구현)
  setOAuthState(
    state: string,
    data: import('../../auth/auth.service').StoredOAuthState,
    ttl: number // In-memory 구현에서는 TTL 무시
  ): Promise<void> {
    this.oauthStateMap.set(state, data);
    Logger.log(`OAuth ttl : ${ttl}`);
    return Promise.resolve();
  }

  getOAuthState(
    state: string
  ): Promise<import('../../auth/auth.service').StoredOAuthState | undefined> {
    return Promise.resolve(this.oauthStateMap.get(state));
  }

  deleteOAuthState(state: string): Promise<void> {
    this.oauthStateMap.delete(state);
    return Promise.resolve();
  }
}
