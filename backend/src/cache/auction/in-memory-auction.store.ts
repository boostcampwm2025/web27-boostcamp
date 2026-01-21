import { AuctionData } from '../types/auction-data.type';
import { AuctionStore } from './auction.store';

export class InMemoryAuctionStore extends AuctionStore {
  private readonly auctionDataMap = new Map<string, AuctionData>();

  set(auctionId: string, auctionData: AuctionData): Promise<void> {
    this.auctionDataMap.set(auctionId, auctionData);
    return Promise.resolve();
  }

  get(auctionId: string): Promise<AuctionData | undefined> {
    return Promise.resolve(this.auctionDataMap.get(auctionId));
  }

  delete(auctionId: string): Promise<void> {
    this.auctionDataMap.delete(auctionId);
    return Promise.resolve();
  }
}
