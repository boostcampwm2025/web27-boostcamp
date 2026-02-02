import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { CacheRepository } from 'src/cache/repository/cache.repository.interface';
import { CreateClickLogDto } from './dto/create-click-log.dto';
import { CreateDismissLogDto } from './dto/create-dismiss-log.dto';
import { CampaignCacheRepository } from 'src/campaign/repository/campaign.cache.repository.interface';

@Injectable()
export class SdkService {
  private readonly logger = new Logger(SdkService.name);

  constructor(
    private readonly logRepository: LogRepository,
    private readonly cacheRepository: CacheRepository,
    private readonly campaignCacheRepository: CampaignCacheRepository
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
      visitorId,
      isHighIntent
    );
    if (dedupResult.status === 'exists') {
      return dedupResult.viewId;
    }

    if (dedupResult.status === 'locked') {
      const existingViewId =
        await this.cacheRepository.getViewIdByIdempotencyKey(
          postUrl,
          visitorId,
          isHighIntent
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
      isHighIntent,
      viewId
    );

    // Rollback 정보 Redis 저장 (TTL 5분)
    await this.cacheRepository.setRollbackInfo(viewId, {
      campaignId,
      cost,
      createdAt: new Date().toISOString(),
    });

    this.logger.debug(
      `[SDK ViewLog] Rollback 정보 저장: viewId=${viewId}, campaign=${campaignId}, cost=${cost} (TTL 5분)`
    );

    return viewId;
  }

  async recordClick(dto: CreateClickLogDto): Promise<number | null> {
    const { viewId } = dto;

    const isDup = await this.cacheRepository.setClickIdempotencyKey(viewId);

    if (isDup) {
      this.logger.debug(`[SDK ClickLog] 중복 클릭: viewId=${viewId}`);
      return null;
    }

    const exists = await this.logRepository.existsByViewId(viewId);
    if (!exists) {
      throw new BadRequestException('잘못된 요청입니다.');
    }

    const clickId = await this.logRepository.saveClickLog({ viewId });

    // 클릭 시 Rollback 정보 삭제 (Dismiss Beacon이 와도 무시되도록)
    await this.cacheRepository.deleteRollbackInfo(viewId);

    this.logger.log(
      `[SDK ClickLog] 클릭 기록 완료: viewId=${viewId}, clickId=${clickId} (Rollback 정보 삭제 → Spent 유지)`
    );

    return clickId;
  }

  async recordDismiss(dto: CreateDismissLogDto): Promise<void> {
    const { viewId } = dto;

    this.logger.debug(`[SDK Dismiss] 시작: viewId=${viewId}`);

    // 1. Redis에서 Rollback 정보 조회
    const rollbackInfo = await this.cacheRepository.getRollbackInfo(viewId);
    if (!rollbackInfo) {
      // TTL 만료 또는 이미 처리됨 → 무시
      this.logger.warn(
        `[SDK Dismiss] RollbackInfo not found for viewId=${viewId} (TTL 만료 또는 이미 처리됨)`
      );
      return;
    }

    const { campaignId, cost, createdAt } = rollbackInfo;
    const elapsedMs = Date.now() - new Date(createdAt).getTime();

    this.logger.debug(
      `[SDK Dismiss] RollbackInfo 조회 성공: viewId=${viewId}, campaign=${campaignId}, cost=${cost}, elapsed=${Math.floor(elapsedMs / 1000)}s`
    );

    // 2. Spent 롤백 (Phase 2에서 구현된 메서드 사용)
    await this.campaignCacheRepository.decrementSpent(campaignId, cost);

    // 3. Redis에서 Rollback 정보 삭제 (중복 방지)
    await this.cacheRepository.deleteRollbackInfo(viewId);

    this.logger.log(
      `[SDK Dismiss] 롤백 완료: viewId=${viewId}, campaign=${campaignId}, cost=-${cost} (일일/총), elapsed=${Math.floor(elapsedMs / 1000)}s`
    );
  }
}
