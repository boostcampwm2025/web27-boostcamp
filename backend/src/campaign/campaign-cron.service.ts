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

  // Step 1: 종료일 지난 캠페인 ENDED (Redis First - 비딩 차단)
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
        this.logger.log(
          `캠페인 ${campaign.id} 종료 (ACTIVE/PAUSED -> ENDED): 날짜 만료`
        );
      }
    }
    return stoppedCount;
  }

  // Step 5: 시작일 된 캠페인 ACTIVE (DB First)
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

  // Step 2 & Hourly: ClickLog 기반 Spent 정산 (배치 처리 + Locking)
  private async reconcileSpentFromClickLog(targetDate: Date): Promise<number> {
    this.logger.log(
      `ClickLog 기반 Spent 정산 시작 (대상일: ${targetDate.toISOString().split('T')[0]})`
    );

    const dailyAggregation =
      await this.logRepository.aggregateClicksByDate(targetDate);
    const totalAggregation =
      await this.logRepository.aggregateTotalClicksByCampaign();

    const totalSpentMap = new Map(
      totalAggregation.map((a) => [a.campaignId, a.totalCost])
    );

    // 배치 처리 설정
    const BATCH_SIZE = 10;
    let reconciledCount = 0;

    // dailyAggregation 배열을 배치 단위로 처리
    for (let i = 0; i < dailyAggregation.length; i += BATCH_SIZE) {
      const batch = dailyAggregation.slice(i, i + BATCH_SIZE);
      const campaignIds = batch.map((b) => b.campaignId);

      // 1. Batch Locking: 처리 중인 캠페인 잠시 중단 (Redis Status -> PAUSED)
      // 주의: 원래 ACTIVE였던 것만 복구해야 함
      const originalStatuses = new Map<string, string>();

      await Promise.all(
        campaignIds.map(async (id) => {
          const cached =
            await this.campaignCacheRepository.findCampaignCacheById(id);
          if (cached && cached.status === 'ACTIVE') {
            originalStatuses.set(id, 'ACTIVE');
            cached.status = CampaignStatus.PAUSED; // 임시 정지
            await this.campaignCacheRepository.saveCampaignCacheById(
              id,
              cached
            );
          }
        })
      );

      // 2. 정산 수행
      await Promise.all(
        batch.map(async (daily) => {
          const { campaignId, totalCost: actualDailySpent } = daily;
          const actualTotalSpent = totalSpentMap.get(campaignId) || 0;

          const cached =
            await this.campaignCacheRepository.findCampaignCacheById(
              campaignId
            );

          // 정합성 검사
          if (
            !cached ||
            cached.dailySpent !== actualDailySpent ||
            Math.abs(cached.totalSpent - actualTotalSpent) > 100
          ) {
            // DB 업데이트
            await this.campaignRepository.updateSpent(
              campaignId,
              actualDailySpent,
              actualTotalSpent
            );

            // Redis 보정
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

      // 3. Batch Unlocking: 원래 상태 복구
      await Promise.all(
        campaignIds.map(async (id) => {
          if (originalStatuses.get(id) === 'ACTIVE') {
            const cached =
              await this.campaignCacheRepository.findCampaignCacheById(id);
            if (cached) {
              cached.status = CampaignStatus.ACTIVE;
              await this.campaignCacheRepository.saveCampaignCacheById(
                id,
                cached
              );
            }
          }
        })
      );

      // 배치 간 약간의 지연으로 DB 부하 조절
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.logger.log(
      `ClickLog 기반 Spent 정산 완료: ${reconciledCount}개 캠페인 보정`
    );
    return reconciledCount;
  }

  // Step 2-1: 예산 소진 캠페인 PAUSED (기존 유지)
  private async pauseOverspentCampaigns(): Promise<number> {
    // ... (기존 로직 유지)
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
        await this.campaignRepository.updateStatus(
          campaign.id,
          CampaignStatus.PAUSED
        );
        await this.syncCacheStatus(campaign.id, CampaignStatus.PAUSED);
        pausedCount++;
      }
    }
    return pausedCount;
  }

  // ========================================
  // Legacy Methods (호환성 유지)
  // ========================================

  // 기존 updateCampaignStatuses 대체 (사용 안 함 권장)
  async updateCampaignStatuses() {
    const stopped = await this.stopExpiredCampaigns();
    const started = await this.startScheduledCampaigns();
    return {
      pendingToActive: started,
      activeToEnded: stopped,
      pausedToEnded: 0, // stopExpiredCampaigns에서 처리됨
    };
  }
}
