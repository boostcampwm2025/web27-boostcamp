import { AuctionData } from '../types/auction-data.type';
import { CacheRepository } from './cache.repository.interface';

export class InMemoryCacheRepository extends CacheRepository {
  private readonly auctionDataMap = new Map<string, AuctionData>();

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
}
