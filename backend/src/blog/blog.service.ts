import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { BlogRepository } from './repository/blog.repository.interface';

@Injectable()
export class BlogService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly blogRepository: BlogRepository
  ) {}
  async createBlog(payload: {
    blogName: string;
    blogUrl: string;
    userId: number;
  }): Promise<string> {
    const { blogName, blogUrl, userId } = payload;

    const isPublisher = await this.userRepository.verifyRole(
      userId,
      UserRole.PUBLISHER
    );

    if (!isPublisher) {
      throw new BadRequestException(
        '퍼블리셔 계정만 블로그를 등록할 수 있습니다.'
      );
    }

    const blogKey = randomUUID();

    let domain: string;
    try {
      domain = new URL(blogUrl).hostname;
    } catch {
      throw new BadRequestException('유효한 블로그 URL을 입력해주세요.');
    }
    if (await this.blogRepository.existsBlogByDomain(domain)) {
      throw new ConflictException('이미 등록된 도메인입니다.');
    }
    try {
      await this.blogRepository.createBlog(userId, domain, blogName, blogKey);
    } catch {
      throw new InternalServerErrorException(
        '블로그 생성중 문제가 발생했습니다.'
      );
    }

    return blogKey;
  }

  async getMyBlogExists(userId: number): Promise<boolean> {
    if (await this.userRepository.verifyRole(userId, UserRole.ADVERTISER)) {
      throw new BadRequestException('잘못된 Role의 접근입니다.');
    }
    return await this.blogRepository.existsBlogByUserId(userId);
  }

  async getMyBlogKey(userId: number): Promise<string> {
    if (await this.userRepository.verifyRole(userId, UserRole.ADVERTISER)) {
      throw new BadRequestException('잘못된 Role의 접근입니다.');
    }
    const blog = await this.blogRepository.findById(userId);

    if (!blog) {
      throw new NotFoundException('사용자의 블로그가 존재하지 않습니다.');
    }

    return blog.blogKey;
  }
}
