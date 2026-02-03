import { BlogEntity } from '../entities/blog.entity';

export abstract class BlogRepository {
  abstract createBlog(
    userId: number,
    domain: string,
    name: string,
    blogKey: string
  ): Promise<number>;

  abstract existsBlogByDomain(domain: string): Promise<boolean>;

  // blogId로 블로그 조회
  abstract findById(id: number): Promise<BlogEntity | null>;

  // userId로 블로그 조회
  abstract findByUserId(userId: number): Promise<BlogEntity | null>;

  // blogKey로 블로그 조회 (SDK 연동용)
  abstract findByBlogKey(blogKey: string): Promise<BlogEntity | null>;
  abstract existsBlogByUserId(userId: number): Promise<boolean>;

  // blogId로 userId 조회 (퍼블리셔 수익 지급용)
  abstract getUserIdByBlogId(blogId: number): Promise<number | null>;

  // 모든 블로그 조회 (초기 로딩용)
  abstract getAll(): Promise<BlogEntity[]>;
}
