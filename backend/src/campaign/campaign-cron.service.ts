import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignRepository } from './repository/campaign.repository';
import { CampaignStatus } from './entities/campaign.entity';

@Injectable()
export class CampaignCronService {
  private readonly logger = new Logger(CampaignCronService.name);

  constructor(private readonly campaignRepository: CampaignRepository) {}

  // 매일 자정(00:00)에 상태 자동 업데이트
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateCampaignStatuses(): Promise<void> {
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
    } catch (error) {
      this.logger.error('캠페인 상태 업데이트 중 오류 발생', error);
    }
  }

  // 매일 자정(00:00)에 일일 예산 리셋
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetDailyBudgets(): Promise<void> {
    this.logger.log('일일 예산 리셋 시작');

    try {
      await this.campaignRepository.resetAllDailySpent();
      this.logger.log('모든 캠페인의 일일 예산이 리셋되었습니다');
    } catch (error) {
      this.logger.error('일일 예산 리셋 중 오류 발생', error);
    }
  }
}
