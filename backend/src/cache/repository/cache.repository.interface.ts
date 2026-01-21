import { AuctionData } from '../types/auction-data.type';

export abstract class CacheRepository {
  abstract setAuctionData(
    auctionId: string,
    auctionData: AuctionData,
    ttl?: number
  ): Promise<void>;
  abstract getAuctionData(auctionId: string): Promise<AuctionData | undefined>;
  abstract deleteAuctionData(auctionId: string): Promise<void>;
}
