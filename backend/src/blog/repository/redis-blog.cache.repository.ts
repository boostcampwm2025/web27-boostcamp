import { Inject, Injectable, Logger } from '@nestjs/common';
import { IOREDIS_CLIENT } from 'src/redis/redis.constant';
import type { AppIORedisClient } from 'src/redis/redis.type';
import { BlogCacheRepository } from './blog.cache.repository.interface';
import { CachedBlog } from '../types/blog.type';

@Injectable()
export class BlogRedisCacheRepository implements BlogCacheRepository {
  private readonly logger = new Logger(BlogRedisCacheRepository.name);
  private readonly BLOG_CACHE_TTL = 60 * 60 * 24; // 24시간
  private readonly BLOG_EXISTS_SET = 'blog:exists:set';
  private readonly KEY_PREFIX = 'blog:';

  constructor(
    @Inject(IOREDIS_CLIENT) private readonly ioredisClient: AppIORedisClient
  ) {}

  async saveBlogCacheById(
    id: number,
    data: CachedBlog,
    ttl?: number
  ): Promise<void> {
    const key = this.getBlogKey(id);
    const expiryTime = ttl ?? this.BLOG_CACHE_TTL;

    // TODO: 블로그 삭제 로직 부재 따라서 없어진 블로그에 대해서 거르는 로직을 구현할 수가 없음
    try {
      // JSON.SET은 cacheManager가 지원 안 해서 redisClient 직접 사용
      await this.ioredisClient.call('JSON.SET', key, '$', JSON.stringify(data));

      await this.ioredisClient.expire(key, expiryTime);

      // exists set에 추가
      await this.ioredisClient.sadd(this.BLOG_EXISTS_SET, id.toString());
    } catch (error) {
      this.logger.error(`블로그 ${id} 캐시 실패:`, error);
      throw error;
    }
  }

  async findBlogCacheById(id: number): Promise<CachedBlog | null> {
    const key = this.getBlogKey(id);

    try {
      const result = await this.ioredisClient.call('JSON.GET', key);

      // 타입 가드: string인지 확인
      if (typeof result !== 'string' || !result) {
        this.logger.debug(`블로그 캐시 미스: ${id}`);
        return null;
      }

      return JSON.parse(result) as CachedBlog;
    } catch (error) {
      this.logger.error(`블로그 캐시 조회 실패: ${id}`, error);
      return null;
    }
  }

  async existsBlogCacheById(id: number): Promise<boolean> {
    try {
      const result = await this.ioredisClient.sismember(
        this.BLOG_EXISTS_SET,
        id.toString()
      );

      return result === 1;
    } catch (error) {
      this.logger.error(`블로그 존재 확인 실패: ${id}`, error);
      return false;
    }
  }

  async deleteBlogCacheById(id: number): Promise<void> {
    const key = this.getBlogKey(id);

    try {
      await this.ioredisClient.del(key);
      // exists set에서 삭제
      await this.ioredisClient.srem(this.BLOG_EXISTS_SET, id.toString());
    } catch (error) {
      this.logger.error(`블로그 캐시 삭제 실패: ${id}`, error);
      throw error;
    }
  }

  async updateBlogEmbeddingById(
    id: number,
    embedding: number[]
  ): Promise<void> {
    const key = this.getBlogKey(id);

    try {
      await this.ioredisClient.call(
        'JSON.SET',
        key,
        '$.embedding', // embedding속성에 따로 임베딩 값 저장
        JSON.stringify(embedding)
      );
    } catch (error) {
      this.logger.error(`블로그 임베딩 업데이트 실패 ${id}:`, error);
      throw error;
    }
  }

  async addBlogToExistsSet(id: number): Promise<void> {
    try {
      await this.ioredisClient.sadd(this.BLOG_EXISTS_SET, id.toString());
    } catch (error) {
      this.logger.error(`blog:exists:set 추가 실패: ${id}`, error);
      throw error;
    }
  }

  private getBlogKey(id: number): string {
    return `${this.KEY_PREFIX}${id}`;
  }
}
