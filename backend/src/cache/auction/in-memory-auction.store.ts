import { AuctionData } from '../types/auction-data.type';
import { AuctionStore } from './auction.store';

export class InMemoryAuctionStore extends AuctionStore {
  private readonly auctionDataMap = new Map<string, AuctionData>();

  set(auctionId: string, auctionData: AuctionData): void {
    this.auctionDataMap.set(auctionId, auctionData);
  }

  get(auctionId: string): AuctionData | undefined {
    return this.auctionDataMap.get(auctionId);
  }

  delete(auctionId: string): void {
    this.auctionDataMap.delete(auctionId);
  }
}
