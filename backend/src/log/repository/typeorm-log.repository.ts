import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogRepository } from './log.repository.interface';
import { ViewLogEntity } from '../entities/view-log.entity';
import { ClickLogEntity } from '../entities/click-log.entity';
import { SaveViewLog } from '../types/save-view-log.type';
import { SaveClickLog } from '../types/save-click-log.type';

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
      createdAt: Date;
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

    // Total count
    const total = await queryBuilder.getCount();

    // Paginated logs
    const results = await queryBuilder
      .skip(offset)
      .take(limit)
      .select([
        'click_log.id',
        'click_log.created_at',
        'view_log.post_url',
        'view_log.cost',
        'view_log.behavior_score',
        'view_log.is_high_intent',
        'blog.name',
      ])
      .getRawMany<{
        click_log_id: number;
        click_log_created_at: Date;
        view_log_post_url: string | null;
        view_log_cost: number;
        view_log_behavior_score: number | null;
        view_log_is_high_intent: boolean;
        blog_name: string;
      }>();

    const logs = results.map((row) => ({
      id: row.click_log_id,
      createdAt: new Date(row.click_log_created_at),
      postUrl: row.view_log_post_url,
      blogName: row.blog_name,
      cost: row.view_log_cost,
      behaviorScore: row.view_log_behavior_score,
      isHighIntent: row.view_log_is_high_intent,
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
}
