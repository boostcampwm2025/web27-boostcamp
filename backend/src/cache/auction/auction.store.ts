import { AuctionData } from '../types/auction-data.type';

export abstract class AuctionStore {
  abstract set(
    auctionId: string,
    auctionData: AuctionData,
    ttl?: number
  ): Promise<void>;
  abstract get(auctionId: string): Promise<AuctionData | undefined>;
  abstract delete(auctionId: string): Promise<void>;
}
