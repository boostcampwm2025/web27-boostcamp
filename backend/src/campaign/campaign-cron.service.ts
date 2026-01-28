import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CampaignRepository } from './repository/campaign.repository.interface';
import { CampaignStatus } from './entities/campaign.entity';
import { ImageService } from '../image/image.service';

@Injectable()
export class CampaignCronService {
  private readonly logger = new Logger(CampaignCronService.name);
  private readonly isProduction: boolean;

  constructor(
    private readonly campaignRepository: CampaignRepository,
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
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ACTIVE
          );
          pendingToActive++;
          this.logger.log(`캠페인 ${campaign.id} 상태 변경: PENDING -> ACTIVE`);
        }

        // ACTIVE -> ENDED: 종료일이 지났을 때
        if (campaign.status === 'ACTIVE' && now >= endDate) {
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ENDED
          );
          activeToEnded++;
          this.logger.log(`캠페인 ${campaign.id} 상태 변경: ACTIVE -> ENDED`);
        }

        // PAUSED -> ENDED: 종료일이 지났을 때
        if (campaign.status === 'PAUSED' && now >= endDate) {
          await this.campaignRepository.updateStatus(
            campaign.id,
            CampaignStatus.ENDED
          );
          pausedToEnded++;
          this.logger.log(`캠페인 ${campaign.id} 상태 변경: PAUSED -> ENDED`);
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

  // 일일 예산 리셋 (수동 실행 가능)
  async resetDailyBudgets(): Promise<void> {
    this.logger.log('일일 예산 리셋 시작');

    try {
      await this.campaignRepository.resetAllDailySpent();
      this.logger.log('모든 캠페인의 일일 예산이 리셋되었습니다');
    } catch (error) {
      this.logger.error('일일 예산 리셋 중 오류 발생', error);
      throw error;
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
