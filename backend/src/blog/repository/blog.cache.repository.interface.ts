import { CachedBlog } from '../types/blog.type';

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

  // blog:exists:set 관리
  abstract addBlogToExistsSet(id: number): Promise<void>;

  // blogKey로 캐시된 블로그 조회 (O(1) - 인덱스 활용)
  abstract findByBlogKey(blogKey: string): Promise<CachedBlog | null>;

  // blogKey → blogId 인덱스 저장
  abstract saveBlogKeyIndex(blogKey: string, blogId: number): Promise<void>;
}
