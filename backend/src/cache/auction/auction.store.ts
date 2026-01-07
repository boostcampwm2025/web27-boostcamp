import { AuctionData } from '../types/auction-data.type';

export abstract class AuctionStore {
  abstract set(auctionId: string, auctionData: AuctionData): void;
  abstract get(auctionId: string): AuctionData | undefined;
  abstract delete(auctionId: string): void;
}
