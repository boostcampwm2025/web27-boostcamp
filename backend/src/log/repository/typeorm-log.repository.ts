import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository.interface';
import { ViewLogEntity } from '../entities/view-log.entity';
import { ClickLogEntity } from '../entities/click-log.entity';
import {
  SaveClickLog,
  SaveViewLog,
  AggregateClick,
  AggregateClickRaw,
} from '../types/log.type';

@Injectable()
export class TypeOrmLogRepository extends LogRepository {
  constructor(
    @InjectRepository(ViewLogEntity)
    private readonly viewLogRepository: Repository<ViewLogEntity>,
    @InjectRepository(ClickLogEntity)
    private readonly clickLogRepository: Repository<ClickLogEntity>
  ) {
    super();
  }

  async saveViewLog(dto: SaveViewLog): Promise<number> {
    const viewLog = await this.viewLogRepository.save(dto);
    return viewLog.id;
  }

  async saveClickLog(dto: SaveClickLog): Promise<number> {
    const clickLog = await this.clickLogRepository.save(dto);
    return clickLog.id;
  }

  async getViewLog(viewId: number): Promise<SaveViewLog | undefined> {
    const viewLog = await this.viewLogRepository.findOne({
      where: { id: viewId },
    });
    return viewLog ? viewLog : undefined;
  }

  async listViewLogs(): Promise<SaveViewLog[]> {
    const logs = await this.viewLogRepository.find();
    return logs;
  }

  async listClickLogs(): Promise<SaveClickLog[]> {
    const logs = await this.clickLogRepository.find();
    return logs;
  }

  async countViewLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    if (campaignIds.length === 0) {
      return new Map();
    }

    // GROUP BY를 사용한 집계 쿼리
    const results = await this.viewLogRepository
      .createQueryBuilder('view_log')
      .select('view_log.campaign_id', 'campaignId')
      .addSelect('COUNT(*)', 'count')
      .where('view_log.campaign_id IN (:...campaignIds)', { campaignIds })
      .groupBy('view_log.campaign_id')
      .getRawMany<{ campaignId: string; count: string }>();

    // Map으로 변환
    const counts = new Map<string, number>();
    results.forEach((row) => {
      counts.set(row.campaignId, parseInt(row.count, 10));
    });

    // 요청한 모든 campaignId에 대해 0으로 초기화 (없는 경우 대비)
    campaignIds.forEach((id) => {
      if (!counts.has(id)) {
        counts.set(id, 0);
      }
    });

    return counts;
  }

  async countClickLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    if (campaignIds.length === 0) {
      return new Map();
    }

    // ViewLog와 JOIN하여 campaign_id별 ClickLog 집계
    const results = await this.clickLogRepository
      .createQueryBuilder('click_log')
      .innerJoin('click_log.viewLog', 'view_log')
      .select('view_log.campaign_id', 'campaignId')
      .addSelect('COUNT(*)', 'count')
      .where('view_log.campaign_id IN (:...campaignIds)', { campaignIds })
      .groupBy('view_log.campaign_id')
      .getRawMany<{ campaignId: string; count: string }>();

    // Map으로 변환
    const counts = new Map<string, number>();
    results.forEach((row) => {
      counts.set(row.campaignId, parseInt(row.count, 10));
    });

    // 요청한 모든 campaignId에 대해 0으로 초기화
    campaignIds.forEach((id) => {
      if (!counts.has(id)) {
        counts.set(id, 0);
      }
    });

    return counts;
  }

  async getClickHistoryByCampaignId(
    campaignId: string,
    limit: number,
    offset: number
  ): Promise<{
    logs: Array<{
      id: number;
      createdAt: Date | null;
      postUrl: string | null;
      blogName: string;
      cost: number;
      behaviorScore: number | null;
      isHighIntent: boolean;
    }>;
    total: number;
  }> {
    // ClickLog -> ViewLog -> Blog JOIN하여 클릭 히스토리 조회
    const queryBuilder = this.clickLogRepository
      .createQueryBuilder('click_log')
      .innerJoin('click_log.viewLog', 'view_log')
      .innerJoin('Blog', 'blog', 'blog.id = view_log.blog_id')
      .where('view_log.campaign_id = :campaignId', { campaignId })
      .orderBy('click_log.created_at', 'DESC');

    const total = await queryBuilder.getCount();

    const results = await this.clickLogRepository
      .createQueryBuilder('click_log')
      .innerJoin('click_log.viewLog', 'view_log')
      .innerJoin('Blog', 'blog', 'blog.id = view_log.blog_id')
      .where('view_log.campaign_id = :campaignId', { campaignId })
      .orderBy('click_log.created_at', 'DESC')
      .select('click_log.id', 'id')
      .addSelect('click_log.created_at', 'createdAt')
      .addSelect('view_log.post_url', 'postUrl')
      .addSelect('view_log.cost', 'cost')
      .addSelect('view_log.behavior_score', 'behaviorScore')
      .addSelect('view_log.is_high_intent', 'isHighIntent')
      .addSelect('blog.name', 'blogName')
      .offset(offset)
      .limit(limit)
      .getRawMany<{
        id: number;
        createdAt: Date | string;
        postUrl: string | null;
        cost: number;
        behaviorScore: number | null;
        isHighIntent: boolean;
        blogName: string;
      }>();

    const logs = results.map((row) => ({
      id: row.id,
      createdAt: row.createdAt ? new Date(row.createdAt) : null,
      postUrl: row.postUrl,
      blogName: row.blogName,
      cost: row.cost,
      behaviorScore: row.behaviorScore,
      isHighIntent: Boolean(row.isHighIntent),
    }));

    return { logs, total };
  }

  async existsByViewId(viewId: number): Promise<boolean> {
    const viewLog = await this.viewLogRepository
      .createQueryBuilder('v')
      .where('v.id = :viewId', { viewId })
      .getOne();

    if (!viewLog) {
      return false;
    }

    return true;
  }

  // 날짜별 ClickLog 기반 campaignId별 totalCost 집계
  async aggregateClicksByDate(date: Date): Promise<Array<AggregateClick>> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.clickLogRepository
      .createQueryBuilder('click_log')
      .innerJoin('click_log.viewLog', 'view_log')
      .select('view_log.campaign_id', 'campaignId')
      .addSelect('SUM(view_log.cost)', 'totalCost')
      .where('click_log.created_at BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .groupBy('view_log.campaign_id')
      .getRawMany<AggregateClickRaw>();

    return result.map((row) => ({
      campaignId: row.campaignId,
      totalCost: parseInt(row.totalCost, 10) || 0,
    }));
  }

  // 전체 ClickLog 기반 campaignId별 totalCost 집계 (totalSpent 계산용)
  async aggregateTotalClicksByCampaign(): Promise<Array<AggregateClick>> {
    const result = await this.clickLogRepository
      .createQueryBuilder('click_log')
      .innerJoin('click_log.viewLog', 'view_log')
      .select('view_log.campaign_id', 'campaignId')
      .addSelect('SUM(view_log.cost)', 'totalCost')
      .groupBy('view_log.campaign_id')
      .getRawMany<AggregateClickRaw>();

    return result.map((row) => ({
      campaignId: row.campaignId,
      totalCost: parseInt(row.totalCost, 10) || 0,
    }));
  }

  // viewId로 blogId와 cost 조회 (퍼블리셔 수익 지급용)
  async getBlogIdAndCostByViewId(
    viewId: number
  ): Promise<{ blogId: number; cost: number } | null> {
    const viewLog = await this.viewLogRepository.findOne({
      where: { id: viewId },
      select: ['blogId', 'cost'],
    });
    return viewLog ? { blogId: viewLog.blogId, cost: viewLog.cost } : null;
  }
}
