import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { CacheRepository } from 'src/cache/repository/cache.repository.interface';
import { CreateClickLogDto } from './dto/create-click-log.dto';

@Injectable()
export class SdkService {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly cacheRepository: CacheRepository
  ) {}

  async recordView(dto: CreateViewLogDto, visitorId: string) {
    const {
      auctionId,
      campaignId,
      postUrl,
      isHighIntent,
      behaviorScore,
      positionRatio,
    } = dto;

    const auctionData = await this.cacheRepository.getAuctionData(auctionId);
    if (!auctionData) {
      throw new NotFoundException('404 not found');
    }

    const { blogId, cost } = auctionData;

    const dedupResult = await this.cacheRepository.acquireViewIdempotencyKey(
      postUrl,
      visitorId
    );
    if (dedupResult.status === 'exists') {
      return dedupResult.viewId;
    }

    if (dedupResult.status === 'locked') {
      const existingViewId =
        await this.cacheRepository.getViewIdByIdempotencyKey(
          postUrl,
          visitorId
        );
      if (existingViewId !== null) {
        return existingViewId;
      }
      throw new ConflictException('중복 요청 처리 중입니다.');
    }

    const viewId = await this.logRepository.saveViewLog({
      auctionId,
      campaignId,
      blogId,
      postUrl,
      cost,
      positionRatio: positionRatio ?? null,
      isHighIntent,
      behaviorScore,
    });

    await this.cacheRepository.setViewIdempotencyKey(
      postUrl,
      visitorId,
      viewId
    );

    return viewId;
  }

  async recordClick(
    dto: CreateClickLogDto,
    visitorId: string
  ): Promise<number | null> {
    const { viewId, postUrl } = dto;
    // todo: 어뷰징 방지

    const isDup = await this.cacheRepository.setClickIdempotencyKey(
      postUrl,
      visitorId
    );

    if (isDup) {
      return null;
    }
    const exists = await this.logRepository.existsByViewId(viewId);
    if (!exists) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    return await this.logRepository.saveClickLog({ viewId });
  }
}
