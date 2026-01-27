import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { IOREDIS_CLIENT } from './redis.constant';
import type { AppIORedisClient } from './redis.type';

@Injectable()
export class RedisIndexService implements OnModuleInit {
  private readonly logger = new Logger(RedisIndexService.name);

  constructor(
    @Inject(IOREDIS_CLIENT) private readonly ioredisClient: AppIORedisClient
  ) {}

  async onModuleInit() {
    // 서버 시작 시 인덱스 자동 생성
    await this.createBlogIndex();
    await this.createCampaignIndex();
  }

  /**
   * Blog 인덱스 생성 -> vector search를 하려면 인덱스가 필요하다고 하네요 -> 비슷한 것들끼리 그래프 구조로 저장!
   * - id, userId, domain, name, blogKey, verified, createdAt
   * - embedding (VECTOR, HNSW, 384 dimensions)
   */
  async createBlogIndex(): Promise<void> {
    const indexName = 'idx:blog';

    try {
      // 인덱스 존재 확인
      const exists = await this.indexExists(indexName);
      if (exists) {
        this.logger.log(`Blog 인덱스가 이미 존재합니다: ${indexName}`);
        return;
      }

      // FT.CREATE 명령어로 인덱스 생성
      await this.ioredisClient.call(
        'FT.CREATE',
        indexName,
        'ON',
        'JSON',
        'PREFIX',
        '1',
        'blog:',
        'SCHEMA',
        '$.id',
        'AS',
        'id',
        'NUMERIC',
        '$.userId',
        'AS',
        'userId',
        'NUMERIC',
        '$.domain',
        'AS',
        'domain',
        'TEXT',
        '$.name',
        'AS',
        'name',
        'TEXT',
        '$.blogKey',
        'AS',
        'blogKey',
        'TAG',
        '$.verified',
        'AS',
        'verified',
        'TAG',
        '$.createdAt',
        'AS',
        'createdAt',
        'TEXT',
        '$.embedding',
        'AS',
        'embedding',
        'VECTOR',
        'HNSW',
        '6',
        'TYPE',
        'FLOAT32',
        'DIM',
        '384',
        'DISTANCE_METRIC',
        'COSINE'
      );

      this.logger.log(`✅ Blog 인덱스 생성 완료: ${indexName}`);
    } catch (error) {
      this.logger.error(`Blog 인덱스 생성 실패: ${indexName}`, error);
      throw error;
    }
  }

  /**
   * Campaign 인덱스 생성
   * - id, userId, title, content, status, isHighIntent
   * - embedding (VECTOR, HNSW, 384 dimensions)
   */
  async createCampaignIndex(): Promise<void> {
    const indexName = 'idx:campaign';

    try {
      // 인덱스 존재 확인
      const exists = await this.indexExists(indexName);
      if (exists) {
        this.logger.log(`Campaign 인덱스가 이미 존재합니다: ${indexName}`);
        return;
      }

      // FT.CREATE 명령어로 인덱스 생성
      await this.ioredisClient.call(
        'FT.CREATE',
        indexName,
        'ON',
        'JSON',
        'PREFIX',
        '1',
        'campaign:',
        'SCHEMA',
        '$.id',
        'AS',
        'id',
        'TAG',
        '$.userId',
        'AS',
        'userId',
        'NUMERIC',
        '$.title',
        'AS',
        'title',
        'TEXT',
        '$.content',
        'AS',
        'content',
        'TEXT',
        '$.status',
        'AS',
        'status',
        'TAG',
        '$.isHighIntent',
        'AS',
        'isHighIntent',
        'TAG',
        '$.embedding',
        'AS',
        'embedding',
        'VECTOR',
        'HNSW',
        '6',
        'TYPE',
        'FLOAT32',
        'DIM',
        '384',
        'DISTANCE_METRIC',
        'COSINE'
      );

      this.logger.log(`✅ Campaign 인덱스 생성 완료: ${indexName}`);
    } catch (error) {
      this.logger.error(`Campaign 인덱스 생성 실패: ${indexName}`, error);
      throw error;
    }
  }

  /**
   * 인덱스 존재 확인
   */
  async indexExists(indexName: string): Promise<boolean> {
    try {
      await this.ioredisClient.call('FT.INFO', indexName);
      return true;
    } catch {
      // 인덱스가 없으면 에러 발생
      return false;
    }
  }

  /**
   * 인덱스 삭제 (개발/테스트용)
   */
  async dropIndex(indexName: string): Promise<void> {
    try {
      await this.ioredisClient.call('FT.DROPINDEX', indexName);
      this.logger.log(`인덱스 삭제 완료: ${indexName}`);
    } catch (_error) {
      this.logger.error(`인덱스 삭제 실패: ${indexName}`);
      throw _error;
    }
  }
}
