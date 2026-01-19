import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { AuctionStore } from 'src/cache/auction/auction.store';
import { CreateClickLogDto } from './dto/create-click-log.dto';

@Injectable()
export class SdkService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly auctionStore: AuctionStore
  ) {}

  async recordView(dto: CreateViewLogDto) {
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
    return await this.logRepository.saveViewLog({
      auctionId,
      campaignId,
      blogId,
      postUrl,
      cost,
      positionRatio: positionRatio ?? null,
      isHighIntent,
      behaviorScore,
      createdAt: new Date(),
    });
  }

  async recordClick(dto: CreateClickLogDto) {
    const { viewId } = dto;
    return await this.logRepository.saveClickLog({
      viewId,
      createdAt: new Date(),
    });
  }
}
