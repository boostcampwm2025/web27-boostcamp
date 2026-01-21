import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { AuctionStore } from 'src/cache/auction/auction.store.interface';
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

    // TODO: 추후 redis로 마이그레이션 필요할 거 같음
    const auctionData = await this.auctionStore.get(auctionId);
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
    });
  }

  async recordClick(dto: CreateClickLogDto) {
    const { viewId } = dto;
    return await this.logRepository.saveClickLog({ viewId });
  }
}
