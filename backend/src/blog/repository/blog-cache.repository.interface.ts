import { CachedBlog } from '../types/blog.types';

export abstract class BlogCacheRepository {
  abstract saveBlogCacheById(
    id: number,
    data: CachedBlog,
    ttl?: number
  ): Promise<void>;

  abstract findBlogCacheById(id: number): Promise<CachedBlog | null>;

  abstract existsBlogCacheById(id: number): Promise<boolean>;

  abstract deleteBlogCacheById(id: number): Promise<void>;

  // embedding을 나중에 worker가 추가하는 용도
  abstract updateBlogEmbeddingById(
    id: number,
    embedding: number[]
  ): Promise<void>;
}
