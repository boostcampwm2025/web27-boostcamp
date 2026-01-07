import { Body, Controller, ForbiddenException, Post } from '@nestjs/common';
import { AuctionStore } from './auction/auction.store';
import { SeedAuctionDto } from './dto/seed-auction.dto';

@Controller('cache')
export class CacheController {
  constructor(private readonly auctionStore: AuctionStore) {}

  @Post('auction')
  seedAuction(@Body() dto: SeedAuctionDto) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    const { auctionId, blogId, cost } = dto;
    this.auctionStore.set(auctionId, { blogId, cost });
    return { auctionId };
  }
}
