import { Inject, Injectable, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { BlogCacheRepository } from './blog-cache.repository';
import { CachedBlog } from '../types/blog.types';
import Redis from 'ioredis';

@Injectable()
export class BlogRedisCacheRepository implements BlogCacheRepository {
  private readonly logger = new Logger(BlogRedisCacheRepository.name);
  private readonly DEFAULT_TTL = 60 * 60; // 1시간
  private readonly BLOG_EXISTS_SET = 'blog:exists:set';

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async saveBlogCacheById(
    id: number,
    data: CachedBlog,
    ttl?: number
  ): Promise<void> {
    const key = this.getBlogKey(id);
    const expiryTime = ttl ?? this.DEFAULT_TTL;

    try {
      (await this.redis.call(
        'JSON.SET',
        key,
        '$',
        JSON.stringify(data)
      )) as Promise<unknown>;

      (await this.redis.expire(key, expiryTime)) as Promise<number>;

      // exists set에 추가
      (await this.redis.sadd(
        this.BLOG_EXISTS_SET,
        id.toString()
      )) as Promise<number>;

      this.logger.log(`Blog ${id} cached successfully with TTL ${expiryTime}s`);
    } catch (error) {
      this.logger.error(`Failed to save blog cache ${id}:`, error);
      throw error;
    }
  }

  async findBlogCacheById(id: number): Promise<CachedBlog | null> {
    const key = this.getBlogKey(id);

    try {
      const result = (await this.redis.call('JSON.GET', key)) as string | null;

      if (!result) {
        this.logger.debug(`Blog ${id} not found in cache`);
        return null;
      }

      return JSON.parse(result) as CachedBlog;
    } catch (error) {
      this.logger.error(`Failed to find blog cache ${id}:`, error);
      return null;
    }
  }

  async existsBlogCacheById(id: number): Promise<boolean> {
    try {
      const result = (await this.redis.sismember(
        this.BLOG_EXISTS_SET,
        id.toString()
      )) as Promise<number>;

      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check blog exists ${id}:`, error);
      return false;
    }
  }

  async deleteBlogCacheById(id: number): Promise<void> {
    const key = this.getBlogKey(id);

    try {
      (await this.redis.del(key)) as Promise<number>;
      (await this.redis.srem(
        this.BLOG_EXISTS_SET,
        id.toString()
      )) as Promise<number>;

      this.logger.log(`Blog ${id} deleted from cache`);
    } catch (error) {
      this.logger.error(`Failed to delete blog cache ${id}:`, error);
      throw error;
    }
  }

  async updateBlogEmbeddingById(
    id: number,
    embedding: number[]
  ): Promise<void> {
    const key = this.getBlogKey(id);

    try {
      (await this.redis.call(
        'JSON.SET',
        key,
        '$.embedding',
        JSON.stringify(embedding)
      )) as Promise<unknown>;

      this.logger.log(`Blog ${id} embedding updated`);
    } catch (error) {
      this.logger.error(`Failed to update blog embedding ${id}:`, error);
      throw error;
    }
  }

  private getBlogKey(id: number): string {
    return `blog:${id}`;
  }
}
