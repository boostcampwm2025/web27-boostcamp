import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOREDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppIORedisClient } from 'src/redis/redis.type';
import { CampaignCacheRepository } from './campaign.cache.repository.interface';
import {
  CachedCampaign,
  CachedCampaignWithoutSpent,
} from '../types/campaign.types';
import {
  REDIS_INCREMENT_SPENT_SCRIPT,
  REDIS_DECREMENT_SPENT_SCRIPT,
} from '../scripts/lua-script';

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

  // 태그 변경 시 임베딩 비우기
  async deleteCampaignEmbeddingById(id: string): Promise<void> {
    const key = this.getCampaignCacheKey(id);
    try {
      await this.ioredisClient.call(
        'JSON.SET',
        key,
        '$.embeddingTags',
        JSON.stringify({})
      );
    } catch (error) {
      this.logger.error(`임베딩 삭제 실패: ${id}`, error);
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

  async incrementSpent(
    campaignId: string,
    cpc: number,
    dailyBudget: number,
    totalBudget: number | null
  ): Promise<boolean> {
    const key = this.getCampaignCacheKey(campaignId);

    try {
      const result = (await this.ioredisClient.eval(
        REDIS_INCREMENT_SPENT_SCRIPT,
        1,
        key,
        cpc.toString(),
        dailyBudget.toString(),
        totalBudget !== null ? totalBudget.toString() : 'null'
      )) as number;

      if (result === 1) {
        this.logger.debug(
          `캠페인 ${campaignId} Spent 증가 성공: +${cpc} (일일/총)`
        );
        return true;
      }

      if (result === 0) {
        this.logger.debug(`캠페인 ${campaignId} 일일 예산 초과로 증가 실패`);
      } else if (result === -1) {
        this.logger.debug(`캠페인 ${campaignId} 총 예산 초과로 증가 실패`);
      } else {
        this.logger.warn(`캠페인 ${campaignId} 캐시 없음 (result: ${result})`);
      }

      return false;
    } catch (error) {
      this.logger.error(`캠페인 ${campaignId} Spent 증가 실패`, error);
      return false;
    }
  }

  async decrementSpent(campaignId: string, cpc: number): Promise<void> {
    const key = this.getCampaignCacheKey(campaignId);

    try {
      const result = (await this.ioredisClient.eval(
        REDIS_DECREMENT_SPENT_SCRIPT,
        1,
        key,
        cpc.toString() // 양수로 전달 (Lua에서 -cpc 처리)
      )) as number;

      if (result === 1) {
        this.logger.debug(
          `캠페인 ${campaignId} Spent 롤백 완료: -${cpc} (일일/총)`
        );
      } else if (result === 0) {
        this.logger.warn(
          `캠페인 ${campaignId} 일일 Spent 음수 방지 (현재값 < ${cpc})`
        );
      } else if (result === -1) {
        this.logger.warn(
          `캠페인 ${campaignId} 총 Spent 음수 방지 (현재값 < ${cpc})`
        );
      } else if (result === -99) {
        this.logger.error(`캠페인 ${campaignId} 캐시 없음 (롤백 실패)`);
      }
    } catch (error) {
      this.logger.error(`캠페인 ${campaignId} Spent 롤백 실패`, error);
      // 롤백 실패는 치명적이지 않음 (과다 차감 방향은 안전)
      // 일일 정산에서 보정됨
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
