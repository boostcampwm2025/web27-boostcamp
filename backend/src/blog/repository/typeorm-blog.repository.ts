import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmBlogRepository extends BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>
  ) {
    super();
  }
  async createBlog(
    userId: number,
    domain: string,
    name: string,
    blogKey: string
  ): Promise<number> {
    const saved = await this.blogRepo.save({ userId, domain, name, blogKey });
    return saved.id;
  }

  async existsBlogByDomain(domain: string): Promise<boolean> {
    const qb = this.blogRepo.createQueryBuilder('b');
    const blog = await qb.where('b.domain = :domain', { domain }).getOne();
    if (blog) {
      return true;
    }

    return false;
  }

  // blogId로 블로그 조회
  async findById(id: number): Promise<BlogEntity | null> {
    return await this.blogRepo.findOne({ where: { id } });
  }

  // blogKey로 블로그 조회 (SDK 연동용)
  async findByBlogKey(blogKey: string): Promise<BlogEntity | null> {
    return await this.blogRepo.findOne({ where: { blogKey } });
  }
}
