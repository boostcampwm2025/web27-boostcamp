import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../entities/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmBlogRepository extends BlogRepository {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>
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
}
