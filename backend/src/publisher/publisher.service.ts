import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { ClickLogEntity } from 'src/log/entities/click-log.entity';
import { ViewLogEntity } from 'src/log/entities/view-log.entity';

@Injectable()
export class PublisherService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(ClickLogEntity)
    private readonly clickLogRepository: Repository<ClickLogEntity>,
    @InjectRepository(ViewLogEntity)
    private readonly viewLogRepository: Repository<ViewLogEntity>
  ) {}

  async getEarningsSummary(userId: number) {
    // 총 누적 수익 (user.balance)
    const totalEarnings = await this.userRepository.getBalanceById(userId);

    // 오늘의 수익 계산 (오늘 00:00:00 이후 클릭된 수익 합계)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarningsResult = await this.clickLogRepository
      .createQueryBuilder('cl')
      .innerJoin('cl.viewLog', 'vl')
      .innerJoin('Blog', 'b', 'b.id = vl.blog_id')
      .where('b.user_id = :userId', { userId })
      .andWhere('cl.created_at >= :today', { today })
      .select('SUM(FLOOR(vl.cost * 0.8))', 'todayEarnings')
      .getRawOne<{ todayEarnings: string | null }>();

    const todayEarnings = todayEarningsResult?.todayEarnings
      ? parseInt(todayEarningsResult.todayEarnings, 10)
      : 0;

    return {
      totalEarnings: totalEarnings ?? 0,
      todayEarnings,
    };
  }

  async getEarningsHistory(userId: number, offset: number, limit: number) {
    // 전체 개수 조회
    const total = await this.clickLogRepository
      .createQueryBuilder('cl')
      .innerJoin('cl.viewLog', 'vl')
      .innerJoin('Blog', 'b', 'b.id = vl.blog_id')
      .where('b.user_id = :userId', { userId })
      .getCount();

    // 히스토리 데이터 조회 (4-way JOIN: ClickLog → ViewLog → Campaign, Blog)
    const results = await this.clickLogRepository
      .createQueryBuilder('cl')
      .innerJoin('cl.viewLog', 'vl')
      .innerJoin('Campaign', 'c', 'c.id = vl.campaign_id')
      .innerJoin('Blog', 'b', 'b.id = vl.blog_id')
      .where('b.user_id = :userId', { userId })
      .orderBy('cl.created_at', 'DESC')
      .select('cl.created_at', 'clickedAt')
      .addSelect('c.title', 'campaignTitle')
      .addSelect('vl.post_url', 'postUrl')
      .addSelect('FLOOR(vl.cost * 0.8)', 'revenue')
      .addSelect('vl.is_high_intent', 'isHighIntent')
      .offset(offset)
      .limit(limit)
      .getRawMany<{
        clickedAt: Date | string;
        campaignTitle: string;
        postUrl: string;
        revenue: number;
        isHighIntent: boolean;
      }>();

    const data = results.map((row) => ({
      clickedAt: new Date(row.clickedAt).toISOString(),
      campaignTitle: row.campaignTitle,
      postUrl: row.postUrl,
      revenue: Number(row.revenue),
      isHighIntent: Boolean(row.isHighIntent),
    }));

    const hasMore = offset + limit < total;

    return {
      data,
      total,
      hasMore,
    };
  }
}
