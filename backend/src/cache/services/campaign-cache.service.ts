import { Inject, Injectable, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import Redis from 'ioredis';

@Injectable()
export class CampaignCacheService {
  private readonly logger = new Logger(CampaignCacheService.name);
  private readonly TTL = 60 * 60 * 24; // 24시간

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // Campaign 데이터를 JSON 형식으로 캐싱
  async cacheCampaign(campaign: CampaignEntity): Promise<void> {
    const key = this.getCampaignKey(campaign.id);

    // 날짜 객체를 ISO 문자열로 변환
    const data = {
      id: campaign.id,
      userId: campaign.userId,
      title: campaign.title,
      content: campaign.content,
      image: campaign.image,
      url: campaign.url,
      maxCpc: campaign.maxCpc,
      dailyBudget: campaign.dailyBudget,
      totalBudget: campaign.totalBudget ?? null,
      dailySpent: campaign.dailySpent,
      totalSpent: campaign.totalSpent,
      lastResetDate: campaign.lastResetDate.toISOString(),
      isHighIntent: campaign.isHighIntent,
      status: campaign.status,
      startDate: campaign.startDate.toISOString(),
      endDate: campaign.endDate.toISOString(),
      createdAt: campaign.createdAt.toISOString(),
      // embedding은 Worker가 나중에 추가
    };

    try {
      // JSON.SET 명령어 실행
      await this.redis.call('JSON.SET', key, '$', JSON.stringify(data));
      await this.redis.expire(key, this.TTL);
    } catch (error) {
      this.logger.error(
        `캠페인 데이터 캐싱에 실패했습니다. ${campaign.id}:`,
        error
      );
    }
  }

  // JSON 데이터 조회
  async getCampaignFromCache(
    id: string
  ): Promise<Record<string, unknown> | null> {
    const key = this.getCampaignKey(id);

    try {
      const result = await this.redis.call('JSON.GET', key);

      if (!result || typeof result !== 'string') return null; // Redis call은 unknown을 반환!!!!!

      return JSON.parse(result) as Record<string, unknown>;
    } catch (error) {
      this.logger.error(`캠페인 데이터 조회에 실패했습니다. ${id}:`, error);
      return null;
    }
  }

  // daily_spent 업데이트 (원자적 연산)
  async updateDailySpent(id: string, amount: number): Promise<void> {
    const key = this.getCampaignKey(id);

    try {
      await this.redis.call(
        'JSON.NUMINCRBY',
        key,
        '$.dailySpent',
        amount.toString()
      );
    } catch (error) {
      this.logger.error(`dailySpent 업데이트에 실패했습니다. ${id}:`, error);
    }
  }

  // Campaign 삭제 (Redis 먼저)
  async deleteCampaign(id: string): Promise<void> {
    const key = this.getCampaignKey(id);
    await this.redis.del(key);
  }

  // Campaign key 생성 헬퍼 함수
  private getCampaignKey(id: string): string {
    return `campaign:${id}`;
  }
}
