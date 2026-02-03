import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CampaignRepository } from './repository/campaign.repository.interface';
import { CampaignCacheRepository } from './repository/campaign.cache.repository.interface';
import { CampaignStatus } from './entities/campaign.entity';
import { ImageService } from '../image/image.service';
import { LogRepository } from '../log/repository/log.repository.interface';

@Injectable()
export class CampaignCronService {
  private readonly logger = new Logger(CampaignCronService.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly campaignCacheRepository: CampaignCacheRepository,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
    private readonly logRepository: LogRepository
  ) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  // ========================================
  // Phase 7: 일일 정산 (DB 동기화)
  // ========================================

  // 매일 자정에 일일 정산 실행 (통합 Cron)
  // 실행 순서: 종료처리 -> 정산 -> 리셋 -> 시작처리
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledDailyReconciliation(): Promise<void> {
    this.logger.log('===== 일일 정산 시작 =====');

    try {
      // 1. 종료일 지난 캠페인 ENDED (Redis First) - 비딩 차단 최우선
      const stoppedCount = await this.stopExpiredCampaigns();

      // 2. 예산 소진 캠페인 PAUSED (Redis → DB)
      const pausedCount = await this.pauseOverspentCampaigns();

      // 3. ClickLog 기반 Spent 정산 (ClickLog → DB → Redis) - 배치 처리
      // 자정 정산이므로 '어제' 데이터 기준
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const reconciledCount = await this.reconcileSpentFromClickLog(yesterday);

      // 4. 일일 예산 리셋 (DB → Redis) - 0으로 초기화
      await this.resetDailyBudgets();

      // 5. 시작일 된 캠페인 ACTIVE (DB First)
      const startedCount = await this.startScheduledCampaigns();

      // 6. 고아 이미지 정리 (프로덕션만)
      const orphanImagesDeleted = await this.cleanupOrphanImages();

      this.logger.log(
        `===== 일일 정산 완료 ===== ` +
          `종료: ${stoppedCount}건, ` +
          `예산PAUSED: ${pausedCount}건, ` +
          `정산보정: ${reconciledCount}건, ` +
          `시작: ${startedCount}건,` +
          `고아이미지: ${orphanImagesDeleted}건`
      );
    } catch (error) {
      this.logger.error('일일 정산 중 오류 발생', error);
      throw error;
    }
  }

  // ========================================
  // 시간별 정합성 체크 (매시 정각)
  // ========================================
  @Cron('0 * * * *')
  async hourlyReconciliation(): Promise<void> {
    this.logger.log('시간별 정합성 체크 시작');
    await this.reconcileSpentFromClickLog(new Date());
  }

  // ========================================
  // 수동 트리거 (API용)
  // ========================================
  async manualReset(): Promise<{
    statusUpdate: { started: number; stopped: number; paused: number };
    dailyBudgetReset: boolean;
    orphanImagesDeleted: number;
  }> {
    this.logger.log('수동 Lazy Reset 시작');

    const stopped = await this.stopExpiredCampaigns();
    const paused = await this.pauseOverspentCampaigns();
    const started = await this.startScheduledCampaigns();
    await this.resetDailyBudgets();
    const orphanImagesDeleted = await this.cleanupOrphanImages();

    this.logger.log('수동 Lazy Reset 완료');

    return {
      statusUpdate: { started, stopped, paused },
      dailyBudgetReset: true,
      orphanImagesDeleted,
    };
  }

  // ========================================
  // Private: 개별 작업 메서드
  // ========================================

  //종료일 지난 캠페인 ENDED (Redis First - 비딩 차단)
  private async stopExpiredCampaigns(): Promise<number> {
    const now = new Date();
    // TODO: Redis에서 목록을 가져오는 것이 이상적이지만, 현재 구조상 DB 목록 순회하며 Redis 확인
    const allCampaigns = await this.campaignRepository.getAll();
    let stoppedCount = 0;

    for (const campaign of allCampaigns) {
      if (campaign.deletedAt || campaign.status === 'ENDED') continue;

      const endDate = new Date(campaign.endDate);
      if (now >= endDate) {
        // Redis 먼저 업데이트 (비딩 차단)
        await this.syncCacheStatus(campaign.id, CampaignStatus.ENDED);
        // DB 업데이트
        await this.campaignRepository.updateStatus(
          campaign.id,
          CampaignStatus.ENDED
        );
        stoppedCount++;
        this.logger.log(`캠페인 ${campaign.id} 종료 -> ENDED (날짜 만료)`);
      }
    }
    return stoppedCount;
  }

  // 시작일 된 캠페인 ACTIVE (DB First)
  private async startScheduledCampaigns(): Promise<number> {
    const now = new Date();
    const allCampaigns = await this.campaignRepository.getAll();
    let startedCount = 0;

    for (const campaign of allCampaigns) {
      if (campaign.deletedAt || campaign.status !== 'PENDING') continue;

      const startDate = new Date(campaign.startDate);
      const endDate = new Date(campaign.endDate);

      if (now >= startDate && now < endDate) {
        // DB 업데이트
        await this.campaignRepository.updateStatus(
          campaign.id,
          CampaignStatus.ACTIVE
        );
        // Redis 동기화
        await this.syncCacheStatus(campaign.id, CampaignStatus.ACTIVE);
        startedCount++;
        this.logger.log(`캠페인 ${campaign.id} 시작 (PENDING -> ACTIVE)`);
      }
    }
    return startedCount;
  }

  // 예산 소진 캠페인 PAUSED (Redis First)
  private async pauseOverspentCampaigns(): Promise<number> {
    const allCampaigns = await this.campaignRepository.getAll();
    let pausedCount = 0;

    for (const campaign of allCampaigns) {
      if (campaign.deletedAt || campaign.status !== 'ACTIVE') continue;

      const cached = await this.campaignCacheRepository.findCampaignCacheById(
        campaign.id
      );
      if (!cached) continue;

      const isDailyExhausted = cached.dailySpent >= cached.dailyBudget;
      const isTotalExhausted =
        cached.totalBudget !== null && cached.totalSpent >= cached.totalBudget;

      if (isDailyExhausted || isTotalExhausted) {
        await this.syncCacheStatus(campaign.id, CampaignStatus.PAUSED);
        await this.campaignRepository.updateStatus(
          campaign.id,
          CampaignStatus.PAUSED
        );
        pausedCount++;
        this.logger.log(`캠페인 ${campaign.id} 예산 소진 -> PAUSED`);
      }
    }
    return pausedCount;
  }

  // 일일 예산 리셋
  private async resetDailyBudgets(): Promise<void> {
    this.logger.log('일일 예산 리셋 시작');

    // DB 리셋
    await this.campaignRepository.resetAllDailySpent();

    // Redis 동기화
    const allCampaigns = await this.campaignRepository.getAll();
    let syncCount = 0;

    for (const campaign of allCampaigns) {
      if (campaign.deletedAt) continue;

      const cached = await this.campaignCacheRepository.findCampaignCacheById(
        campaign.id
      );
      if (cached) {
        cached.dailySpent = 0;
        cached.lastResetDate = new Date().toISOString();
        await this.campaignCacheRepository.saveCampaignCacheById(
          // 덮어씌울거면 Q: PAUSED로 변경 후 해야되는 거 아닌가? - updateCampaignWithoutCachedById 이거 쓰면 좋을 거 같은데
          campaign.id,
          cached
        );
        syncCount++;
      }
    }

    this.logger.log(`일일 예산 리셋 완료 (Redis ${syncCount}건 동기화)`);
  }

  private async reconcileSpentFromClickLog(targetDate: Date): Promise<number> {
    this.logger.log(
      `ClickLog 정산 시작 (${targetDate.toISOString().split('T')[0]})`
    );

    const dailyAggregation =
      await this.logRepository.aggregateClicksByDate(targetDate);
    const totalAggregation =
      await this.logRepository.aggregateTotalClicksByCampaign();
    const totalSpentMap = new Map(
      totalAggregation.map((a) => [a.campaignId, a.totalCost])
    );

    const BATCH_SIZE = 10;
    let reconciledCount = 0;

    for (let i = 0; i < dailyAggregation.length; i += BATCH_SIZE) {
      const batch = dailyAggregation.slice(i, i + BATCH_SIZE);
      const campaignIds = batch.map((b) => b.campaignId);

      // Batch Lock
      const originalStatuses = new Map<string, string>();
      await Promise.all(
        campaignIds.map(async (id) => {
          const cached =
            await this.campaignCacheRepository.findCampaignCacheById(id);
          if (cached?.status === 'ACTIVE') {
            originalStatuses.set(id, 'ACTIVE');
            cached.status = CampaignStatus.PAUSED;
            // Q: 이부분도 status만 바꾸는 메서드 쓰는게 낫지 않나? - updateStatus 이거 쓰면 좋을 거 같은데
            await this.campaignCacheRepository.saveCampaignCacheById(
              id,
              cached
            );
          }
        })
      );

      // 정산 수행
      await Promise.all(
        batch.map(async (daily) => {
          const { campaignId, totalCost: actualDailySpent } = daily;
          const actualTotalSpent = totalSpentMap.get(campaignId) || 0;
          const cached =
            await this.campaignCacheRepository.findCampaignCacheById(
              campaignId
            );

          // Q: 여기서 Math.abs는 무슨 의미지?
          const needsReconcile =
            !cached ||
            cached.dailySpent !== actualDailySpent ||
            Math.abs(cached.totalSpent - actualTotalSpent) > 100; // 1~2 클릭 차이로 생긴 오차 보정

          if (needsReconcile) {
            await this.campaignRepository.updateSpent(
              campaignId,
              actualDailySpent,
              actualTotalSpent
            );
            if (cached) {
              cached.dailySpent = actualDailySpent;
              cached.totalSpent = actualTotalSpent;
              await this.campaignCacheRepository.saveCampaignCacheById(
                campaignId,
                cached
              );
              reconciledCount++;
            }
          }
        })
      );

      // Batch Unlock
      await Promise.all(
        campaignIds.map(async (id) => {
          if (originalStatuses.get(id) === 'ACTIVE') {
            const cached =
              await this.campaignCacheRepository.findCampaignCacheById(id);
            if (cached) {
              cached.status = CampaignStatus.ACTIVE;
              // Q: 이부분도 status만 바꾸는 메서드 쓰는게 낫지 않나? - updateStatus 이거 쓰면 좋을 거 같은데
              await this.campaignCacheRepository.saveCampaignCacheById(
                id,
                cached
              );
            }
          }
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.logger.log(`ClickLog 정산 완료: ${reconciledCount}개 보정`);
    return reconciledCount;
  }

  // 고아 이미지 정리용이나 개발환경에서는 스킵
  private async cleanupOrphanImages(): Promise<number> {
    if (!this.isProduction) {
      this.logger.log('개발 환경 - 고아 이미지 정리 스킵');
      return 0;
    }

    this.logger.log('고아 이미지 정리 시작');

    try {
      const storedImages = await this.imageService.listImages('campaigns/');
      const allCampaigns = await this.campaignRepository.getAll();
      const usedImageUrls = new Set(
        allCampaigns.filter((c) => c.image).map((c) => c.image)
      );

      let deletedCount = 0;
      for (const image of storedImages) {
        if (!usedImageUrls.has(image.url)) {
          try {
            await this.imageService.deleteImage(image.url);
            deletedCount++;
            this.logger.log(`고아 이미지 삭제: ${image.key}`);
          } catch (error) {
            this.logger.error(`이미지 삭제 실패: ${image.key}`, error);
          }
        }
      }

      this.logger.log(`고아 이미지 정리 완료: ${deletedCount}개 삭제`);
      return deletedCount;
    } catch (error) {
      this.logger.error('고아 이미지 정리 오류', error);
      return 0;
    }
  }

  // 캐시 상태 동기화 - Q: 이게 왜 필요할까
  private async syncCacheStatus(
    campaignId: string,
    newStatus: CampaignStatus
  ): Promise<void> {
    try {
      const cached =
        await this.campaignCacheRepository.findCampaignCacheById(campaignId);
      if (cached) {
        cached.status = newStatus;
        await this.campaignCacheRepository.saveCampaignCacheById(
          campaignId,
          cached
        );
      }
    } catch (error) {
      this.logger.warn(`캠페인 ${campaignId} Redis 상태 동기화 실패`, error);
    }
  }

  // ========================================
  // Legacy Methods (호환성 유지)
  // ========================================

  // 기존 updateCampaignStatuses 대체 (사용 안 함 권장)
  // async updateCampaignStatuses() {
  //   const stopped = await this.stopExpiredCampaigns();
  //   const started = await this.startScheduledCampaigns();
  //   return {
  //     pendingToActive: started,
  //     activeToEnded: stopped,
  //     pausedToEnded: 0, // stopExpiredCampaigns에서 처리됨
  //   };
  // }
}
