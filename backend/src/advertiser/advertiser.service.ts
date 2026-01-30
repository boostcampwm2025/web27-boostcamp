import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository.interface';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { UserRole, UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { CreditHistoryRepository } from './repository/credit-history.repository.interface';
import {
  CreditHistoryType,
  CreditHistoryEntity,
} from './entities/credit-history.entity';

type Snapshot = {
  endMsExclusive: number;
};

@Injectable()
export class AdvertiserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly logRepository: LogRepository,
    private readonly creditHistoryRepository: CreditHistoryRepository,
    @InjectDataSource() private readonly dataSource: DataSource
  ) {}
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

  async chargeCredit(
    userId: number,
    amount: number,
    description: string = '크레딧 충전'
  ): Promise<{ balanceAfter: number; historyId: number }> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. 사용자 조회 및 잠금
      const userRepo = manager.getRepository(UserEntity);
      const user = await userRepo.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new Error('사용자를 찾을 수 없습니다');
      }

      // 2. 잔액 업데이트
      const newBalance = user.balance + amount;
      user.balance = newBalance;
      await userRepo.save(user);

      // 3. 히스토리 기록
      const historyRepo = manager.getRepository(CreditHistoryEntity);
      const history = await historyRepo.save({
        userId,
        type: CreditHistoryType.CHARGE,
        amount,
        balanceAfter: newBalance,
        campaignId: null,
        description,
      });

      return {
        balanceAfter: newBalance,
        historyId: history.id,
      };
    });
  }

  async getCreditHistory(
    userId: number,
    limit: number,
    offset: number
  ): Promise<{
    histories: Array<{
      id: number;
      type: 'CHARGE' | 'WITHDRAW';
      amount: number;
      balanceAfter: number;
      campaignName: string | null;
      description: string | null;
      createdAt: Date;
    }>;
    total: number;
    hasMore: boolean;
  }> {
    const [histories, total] = await Promise.all([
      this.creditHistoryRepository.findByUserId(userId, limit, offset),
      this.creditHistoryRepository.countByUserId(userId),
    ]);

    const hasMore = offset + limit < total;

    return {
      histories,
      total,
      hasMore,
    };
  }

  // 광고주 키워드 통계 목록 조회 - 테스트 필요
  async getKeywordStats(
    userId: number,
    limit: number = 20,
    offset: number = 0,
    sortBy: 'avgCtr' | 'totalImpressions' | 'totalClicks' = 'avgCtr',
    order: 'asc' | 'desc' = 'desc'
  ) {
    const isAdvertiser = await this.userRepository.verifyRole(
      userId,
      UserRole.ADVERTISER
    );

    if (!isAdvertiser) {
      throw new ForbiddenException();
    }

    // 1. userId로 캠페인 목록 조회 (tags relation 포함)
    const campaigns = await this.campaignRepository.listByUserId(userId);
    const campaignIds = campaigns.map((c) => c.id);

    if (campaignIds.length === 0) {
      return { total: 0, hasMore: false, keywords: [] };
    }

    // 2. 캠페인별 ViewLog, ClickLog 집계 (기존 Repository 메서드 활용)
    const viewCounts =
      await this.campaignRepository.getViewCountsByCampaignIds(campaignIds);
    const clickCounts =
      await this.campaignRepository.getClickCountsByCampaignIds(campaignIds);

    // 3. Tag별로 노출/클릭 합산
    const tagStatsMap = new Map<
      number,
      {
        id: number;
        name: string;
        totalImpressions: number;
        totalClicks: number;
      }
    >();

    for (const campaign of campaigns) {
      const impressions = viewCounts.get(campaign.id) ?? 0;
      const clicks = clickCounts.get(campaign.id) ?? 0;

      for (const tag of campaign.tags) {
        const existing = tagStatsMap.get(tag.id);
        if (existing) {
          existing.totalImpressions += impressions;
          existing.totalClicks += clicks;
        } else {
          tagStatsMap.set(tag.id, {
            id: tag.id,
            name: tag.name,
            totalImpressions: impressions,
            totalClicks: clicks,
          });
        }
      }
    }

    // 4. avgCtr 계산 및 배열로 변환
    const tagStats = Array.from(tagStatsMap.values()).map((stat) => ({
      ...stat,
      avgCtr:
        stat.totalImpressions > 0
          ? roundTo1Decimal((stat.totalClicks / stat.totalImpressions) * 100)
          : 0,
    }));

    // 5. 정렬
    tagStats.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      return order === 'desc' ? bVal - aVal : aVal - bVal;
    });

    // 6. 페이지네이션
    const total = tagStats.length;
    const paginatedKeywords = tagStats.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return { total, hasMore, keywords: paginatedKeywords };
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
