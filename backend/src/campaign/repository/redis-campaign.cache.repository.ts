// src/cache/repository/redis-campaign-cache.repository.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';
import { CampaignCacheRepository } from './campaign.cache.repository.interface';
import { CachedCampaign } from '../types/campaign.types';

@Injectable()
export class RedisCampaignCacheRepository extends CampaignCacheRepository {
  private readonly logger = new Logger(RedisCampaignCacheRepository.name);
  private readonly KEY_PREFIX = 'campaign:';

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    super();
  }

  async saveCampaignCacheById(
    id: string,
    data: CachedCampaign,
    ttl = 60 * 60 * 24
  ): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.redis.call('JSON.SET', key, '$', JSON.stringify(data));
      await this.redis.expire(key, ttl);
      this.logger.debug(`캐시 저장 성공: ${id}`);
    } catch (error) {
      this.logger.error(`캐시 저장 실패: ${id}`, error);
      throw error;
    }
  }

  async findCampaignCacheById(id: string): Promise<CachedCampaign | null> {
    const key = this.getCampaignCacheKey(id);

    try {
      const result = await this.redis.call('JSON.GET', key);

      if (!result || typeof result !== 'string') {
        this.logger.debug(`캐시 미스: ${id}`);
        return null;
      }

      this.logger.debug(`캐시 히트: ${id}`);
      return JSON.parse(result) as CachedCampaign;
    } catch (error) {
      this.logger.error(`캐시 조회 실패: ${id}`, error);
      return null;
    }
  }

  async updateDailySpentCacheById(id: string, amount: number): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.redis.call(
        'JSON.NUMINCRBY', // Redis에게 ADD에 대한 명령을 통한 원자적 연산 수행
        key,
        '$.dailySpent',
        amount.toString()
      );
      this.logger.debug(`dailySpent 증가: ${id} (+${amount})`);
    } catch (error) {
      this.logger.error(`dailySpent 업데이트 실패: ${id}`, error);
      throw error;
    }
  }

  async deleteCampaignCacheById(id: string): Promise<void> {
    const key = this.getCampaignCacheKey(id);
    await this.redis.del(key);
    this.logger.debug(`캐시 삭제: ${id}`);
  }

  async existsCampaignCacheById(id: string): Promise<boolean> {
    const key = this.getCampaignCacheKey(id);
    const result = await this.redis.exists(key);
    return result === 1;
  }

  private getCampaignCacheKey(id: string): string {
    return `${this.KEY_PREFIX}${id}`;
  }
}
