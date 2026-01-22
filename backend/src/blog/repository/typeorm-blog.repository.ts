import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository.interface';
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

  async existsBlogByUserId(userId: number): Promise<boolean> {
    const qb = this.blogRepo.createQueryBuilder('b');
    const blog = await qb.where('b.userId = :id', { id: userId }).getOne();
    if (blog) {
      return true;
    }

    return false;
  }
}
