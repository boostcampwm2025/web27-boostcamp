import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOREDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppIORedisClient } from 'src/redis/redis.type';
import { CampaignCacheRepository } from './campaign.cache.repository.interface';
import {
  CachedCampaign,
  CachedCampaignWithoutSpent,
} from '../types/campaign.types';

@Injectable()
export class RedisCampaignCacheRepository implements CampaignCacheRepository {
  private readonly logger = new Logger(RedisCampaignCacheRepository.name);
  private readonly KEY_PREFIX = 'campaign:';

  constructor(
    @Inject(IOREDIS_CLIENT) private readonly ioredisClient: AppIORedisClient
  ) {}

  async saveCampaignCacheById(
    id: string,
    data: CachedCampaign,
    ttl = 60 * 60 * 24
  ): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.ioredisClient.call('JSON.SET', key, '$', JSON.stringify(data));
      await this.ioredisClient.expire(key, ttl);
    } catch (error) {
      this.logger.error(`캐시 저장 실패: ${id}`, error);
      throw error;
    }
  }

  async findCampaignCacheById(id: string): Promise<CachedCampaign | null> {
    const key = this.getCampaignCacheKey(id);

    try {
      const result = await this.ioredisClient.call('JSON.GET', key);

      if (!result || typeof result !== 'string') {
        this.logger.debug(`캐시 미스: ${id}`);
        return null;
      }

      return JSON.parse(result) as CachedCampaign;
    } catch (error) {
      this.logger.error(`캐시 조회 실패: ${id}`, error);
      return null;
    }
  }

  // 동시성 이슈가 있을 수 있는 Spent를 제외한 나머지 필드 업데이트
  async updateCampaignCacheWithoutSpentById(
    id: string,
    data: CachedCampaignWithoutSpent
  ): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      const updatePromises = Object.entries(data).map(([field, value]) =>
        this.ioredisClient.call(
          'JSON.SET',
          key,
          `$.${field}`,
          JSON.stringify(value)
        )
      );

      await Promise.all(updatePromises);
    } catch (error) {
      this.logger.error(`캐시 저장 실패: ${id}`, error);
      throw error;
    }
  }

  // 상태만 업데이트
  async updateCampaignStatus(id: string, status: string): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.ioredisClient.call(
        'JSON.SET',
        key,
        '$.status',
        JSON.stringify(status)
      );
    } catch (error) {
      this.logger.error(`캠페인 상태 업데이트 실패: ${id}`, error);
      throw error;
    }
  }

  async updateDailySpentCacheById(id: string, amount: number): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.ioredisClient.call(
        'JSON.NUMINCRBY', // Redis에게 ADD에 대한 명령을 통한 원자적 연산 수행
        key,
        '$.dailySpent',
        amount.toString()
      );
    } catch (error) {
      this.logger.error(`dailySpent 업데이트 실패: ${id}`, error);
      throw error;
    }
  }

  async deleteCampaignCacheById(id: string): Promise<void> {
    const key = this.getCampaignCacheKey(id);
    await this.ioredisClient.del(key);
    this.logger.debug(`캐시 삭제: ${id}`);
  }

  async existsCampaignCacheById(id: string): Promise<boolean> {
    const key = this.getCampaignCacheKey(id);
    const result = await this.ioredisClient.exists(key);
    return result === 1;
  }

  async updateCampaignEmbeddingTags(
    id: string,
    embeddingTags: { [tagName: string]: number[] }
  ): Promise<void> {
    const key = this.getCampaignCacheKey(id);

    try {
      await this.ioredisClient.call(
        'JSON.SET',
        key,
        '$.embeddingTags',
        JSON.stringify(embeddingTags)
      );
    } catch (error) {
      this.logger.error(`캠페인 임베딩 업데이트 실패: ${id}`, error);
      throw error;
    }
  }

  // RTB 비딩용: Redis에서 모든 캠페인 조회
  async getAllCampaigns(): Promise<CachedCampaign[]> {
    try {
      const pattern = `${this.KEY_PREFIX}*`;
      const keys: string[] = [];

      // SCAN으로 모든 campaign:* 키 조회
      let cursor = '0';
      do {
        const result = await this.ioredisClient.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100
        );
        cursor = result[0];
        keys.push(...result[1]);
      } while (cursor !== '0');

      if (keys.length === 0) {
        return [];
      }

      // 각 키에 대해 JSON.GET 수행
      const campaigns: CachedCampaign[] = [];

      for (const key of keys) {
        try {
          const result = await this.ioredisClient.call('JSON.GET', key);
          if (result && typeof result === 'string') {
            campaigns.push(JSON.parse(result) as CachedCampaign);
          }
        } catch (error) {
          this.logger.warn(`캠페인 조회 실패: ${key}`, error);
          // 개별 캠페인 조회 실패는 스킵
        }
      }

      return campaigns;
    } catch (error) {
      this.logger.error('모든 캠페인 조회 실패', error);
      return [];
    }
  }

  private getCampaignCacheKey(id: string): string {
    return `${this.KEY_PREFIX}${id}`;
  }
}
