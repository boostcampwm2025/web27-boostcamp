import { ForbiddenException, Injectable } from '@nestjs/common';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { UserRole } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';

type Snapshot = {
  endMsExclusive: number;
};

@Injectable()
export class AdvertiserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly logRepository: LogRepository
  ) {}
  // todo: 추후 DB에 데이터를 넣게되면 로직 수정
  async getDashboardStats(userId: number) {
    const isAdvertiser = await this.userRepository.verifyRole(
      userId,
      UserRole.ADVERTISER
    );

    if (!isAdvertiser) {
      throw new ForbiddenException();
    }

    const campaignIdSet = new Set(
      (await this.campaignRepository.listByUserId(userId)).map(
        (campaign) => campaign.id
      )
    );

    const now = new Date();
    const startOfTodayMs = getKstStartOfDayMs(now);

    const totalPerf = await this.getPerformanceSnapshot(campaignIdSet, {
      endMsExclusive: now.getTime(),
    });
    const yesterdayTotalPerf = await this.getPerformanceSnapshot(
      campaignIdSet,
      {
        endMsExclusive: startOfTodayMs,
      }
    );

    return {
      performance: {
        totalClicks: totalPerf.totalClicks,
        clicksChange: totalPerf.totalClicks - yesterdayTotalPerf.totalClicks,
        totalImpressions: totalPerf.totalImpressions,
        impressionsChange:
          totalPerf.totalImpressions - yesterdayTotalPerf.totalImpressions,
        averageCtr: totalPerf.averageCtr,
        averageCtrChange: roundTo1Decimal(
          totalPerf.averageCtr - yesterdayTotalPerf.averageCtr
        ),
        totalSpent: totalPerf.totalSpent,
      },
    };
  }

  private async getPerformanceSnapshot(
    campaignIdSet: Set<string>,
    snapshot: Snapshot
  ) {
    let totalImpressions = 0;
    const impressionsByCampaign = new Map<string, number>();
    const viewLogs = await this.logRepository.listViewLogs();
    for (const viewLog of viewLogs) {
      if (!viewLog.createdAt) {
        continue;
      }
      if (!isBefore(viewLog.createdAt, snapshot.endMsExclusive)) {
        continue;
      }
      if (!campaignIdSet.has(viewLog.campaignId)) {
        continue;
      }
      totalImpressions += 1;
      impressionsByCampaign.set(
        viewLog.campaignId,
        (impressionsByCampaign.get(viewLog.campaignId) ?? 0) + 1
      );
    }

    let totalClicks = 0;
    let totalSpent = 0;
    const clicksByCampaign = new Map<string, number>();
    const clickLogs = await this.logRepository.listClickLogs();
    for (const clickLog of clickLogs) {
      if (!clickLog.createdAt) {
        continue;
      }
      if (!isBefore(clickLog.createdAt, snapshot.endMsExclusive)) {
        continue;
      }
      const viewLog = await this.logRepository.getViewLog(clickLog.viewId);
      if (!viewLog) {
        continue;
      }
      if (!campaignIdSet.has(viewLog.campaignId)) {
        continue;
      }

      totalClicks += 1;
      totalSpent += viewLog.cost;
      clicksByCampaign.set(
        viewLog.campaignId,
        (clicksByCampaign.get(viewLog.campaignId) ?? 0) + 1
      );
    }

    const averageCtr = getAverageCtrPercent(
      impressionsByCampaign,
      clicksByCampaign
    );

    return { totalImpressions, totalClicks, averageCtr, totalSpent };
  }
}

const roundTo1Decimal = (v: number) => Math.round(v * 10) / 10;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const getAverageCtrPercent = (
  impressionsByCampaign: Map<string, number>,
  clicksByCampaign: Map<string, number>
) => {
  let sumCtr = 0;
  let campaignsWithImpressions = 0;

  for (const [campaignId, impressions] of impressionsByCampaign.entries()) {
    if (impressions <= 0) {
      continue;
    }
    const clicks = clicksByCampaign.get(campaignId) ?? 0;
    sumCtr += (clicks / impressions) * 100;
    campaignsWithImpressions += 1;
  }

  return campaignsWithImpressions === 0
    ? 0
    : roundTo1Decimal(sumCtr / campaignsWithImpressions);
};

const getKstStartOfDayMs = (date: Date) => {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth();
  const day = kst.getUTCDate();
  return Date.UTC(year, month, day) - KST_OFFSET_MS;
};

const isBefore = (d: Date, endMsExclusive: number) =>
  d.getTime() < endMsExclusive;
