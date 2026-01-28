import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CampaignRepository } from './repository/campaign.repository.interface';
import { CampaignCacheRepository } from './repository/campaign.cache.repository.interface';
import { CampaignStatus } from './entities/campaign.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class CampaignCronService {
  private readonly logger = new Logger(CampaignCronService.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly campaignCacheRepository: CampaignCacheRepository,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService
  ) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  // 매일 자정(00:00)에 상태 자동 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledUpdateCampaignStatuses(): Promise<void> {
    await this.updateCampaignStatuses();
  }

  // 캠페인 상태 업데이트 (수동 실행 가능)
  async updateCampaignStatuses(): Promise<{
    pendingToActive: number;
    activeToEnded: number;
    pausedToEnded: number;
  }> {
    this.logger.log('캠페인 상태 자동 업데이트 시작');

    try {
      const now = new Date();
      const allCampaigns = await this.campaignRepository.getAll();

      let pendingToActive = 0;
      let activeToEnded = 0;
      let pausedToEnded = 0;

      for (const campaign of allCampaigns) {
        // 삭제된 캠페인은 스킵
        if (campaign.deletedAt) {
          continue;
        }

        const startDate = new Date(campaign.startDate);
        const endDate = new Date(campaign.endDate);

        // PENDING -> ACTIVE: 시작일이 되었을 때
        if (
          campaign.status === 'PENDING' &&
          now >= startDate &&
          now < endDate
        ) {
          // DB 업데이트
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ACTIVE
          );
          // Redis 동기화
          await this.syncCacheStatus(campaign.id, CampaignStatus.ACTIVE);
          pendingToActive++;
          this.logger.log(
            `캠페인 ${campaign.id} 상태 변경: PENDING -> ACTIVE (DB + Redis)`
          );
        }

        // ACTIVE -> ENDED: 종료일이 지났을 때
        if (campaign.status === 'ACTIVE' && now >= endDate) {
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ENDED
          );
          await this.syncCacheStatus(campaign.id, CampaignStatus.ENDED);
          activeToEnded++;
          this.logger.log(
            `캠페인 ${campaign.id} 상태 변경: ACTIVE -> ENDED (DB + Redis)`
          );
        }

        // PAUSED -> ENDED: 종료일이 지났을 때
        if (campaign.status === 'PAUSED' && now >= endDate) {
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ENDED
          );
          await this.syncCacheStatus(campaign.id, CampaignStatus.ENDED);
          pausedToEnded++;
          this.logger.log(
            `캠페인 ${campaign.id} 상태 변경: PAUSED -> ENDED (DB + Redis)`
          );
        }
      }

      this.logger.log(
        `캠페인 상태 업데이트 완료 - ` +
          `PENDING->ACTIVE: ${pendingToActive}건, ` +
          `ACTIVE->ENDED: ${activeToEnded}건, ` +
          `PAUSED->ENDED: ${pausedToEnded}건`
      );

      return { pendingToActive, activeToEnded, pausedToEnded };
    } catch (error) {
      this.logger.error('캠페인 상태 업데이트 중 오류 발생', error);
      throw error;
    }
  }

  // 매일 자정(00:00)에 일일 예산 리셋
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledResetDailyBudgets(): Promise<void> {
    await this.resetDailyBudgets();
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async scheduledCleanupOrphanImages(): Promise<void> {
  //   await this.cleanupOrphanImages();
  // }

  // 일일 예산 리셋 + Redis 동기화
  async resetDailyBudgets(): Promise<void> {
    this.logger.log('일일 예산 리셋 시작 (DB + Redis)');

    try {
      // 1. DB 리셋
      await this.campaignRepository.resetAllDailySpent();

      // 2. Redis 동기화
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
            campaign.id,
            cached
          );
          syncCount++;
        }
      }

      this.logger.log(`일일 예산 리셋 완료 (DB + Redis ${syncCount}건 동기화)`);
    } catch (error) {
      this.logger.error('일일 예산 리셋 중 오류 발생', error);
      throw error;
    }
  }

  // Redis 캐시 상태 동기화 헬퍼
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
      // Redis 동기화 실패해도 Cron 전체가 실패하지 않도록
    }
  }

  // 수동 Lazy Reset: 상태 업데이트 + 일일 예산 리셋 + 고아 이미지 정리
  async manualReset(): Promise<{
    statusUpdate: {
      pendingToActive: number;
      activeToEnded: number;
      pausedToEnded: number;
    };
    dailyBudgetReset: boolean;
    orphanImagesDeleted: number;
  }> {
    this.logger.log('수동 Lazy Reset 시작');

    const statusUpdate = await this.updateCampaignStatuses();
    await this.resetDailyBudgets();
    const orphanImagesDeleted = await this.cleanupOrphanImages();

    this.logger.log('수동 Lazy Reset 완료');

    return {
      statusUpdate,
      dailyBudgetReset: true,
      orphanImagesDeleted,
    };
  }

  // 고아 이미지 정리: DB에 없는 이미지 삭제
  async cleanupOrphanImages(): Promise<number> {
    // 개발 환경에서는 이미지 삭제 로직 스킵
    if (!this.isProduction) {
      this.logger.log('개발 환경에서는 고아 이미지 정리를 수행하지 않습니다');
      return 0;
    }

    this.logger.log('고아 이미지 정리 시작');

    try {
      // Object Storage에서 모든 이미지 목록 가져오기
      const storedImages = await this.imageService.listImages('campaigns/');

      // DB에서 모든 캠페인의 image URL 가져오기
      const allCampaigns = await this.campaignRepository.getAll();
      const usedImageUrls = new Set(
        allCampaigns
          .filter((campaign) => campaign.image)
          .map((campaign) => campaign.image)
      );

      // 사용되지 않는 이미지 찾기 및 삭제
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

      this.logger.log(`고아 이미지 정리 완료 - ${deletedCount}개 삭제`);
      return deletedCount;
    } catch (error) {
      this.logger.error('고아 이미지 정리 중 오류 발생', error);
      return 0;
    }
  }
}
