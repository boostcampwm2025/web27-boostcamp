import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { BlogRepository } from './repository/blog.repository';

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

    await this.blogRepository.createBlog(userId, domain, blogName, blogKey);

    return blogKey;
  }
}
