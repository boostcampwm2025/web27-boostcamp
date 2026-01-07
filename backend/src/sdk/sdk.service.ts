import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository';
import { AuctionStore } from 'src/cache/auction/auction.store';

@Injectable()
export class SdkService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly auctionStore: AuctionStore
  ) {}
  recordView(dto: CreateViewLogDto) {
    const {
      auctionId,
      campaignId,
      postUrl,
      isHighIntent,
      behaviorScore,
      positionRatio,
    } = dto;

    const auctionData = this.auctionStore.get(auctionId);
    if (!auctionData) {
      throw new NotFoundException('404 not found');
    }

    const { blogId, cost } = auctionData;
    return this.logRepository.saveViewLog({
      auctionId,
      campaignId,
      blogId,
      postUrl,
      cost,
      positionRatio,
      isHighIntent,
      behaviorScore,
      createdAt: new Date(),
    });
  }
}
