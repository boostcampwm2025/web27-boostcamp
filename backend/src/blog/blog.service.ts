import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { UserRole } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { BlogRepository } from './repository/blog.repository.interface';
import { BlogCacheRepository } from './repository/blog.cache.repository.interface';
import { BlogEntity } from './entities/blog.entity';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly blogRepository: BlogRepository,
    private readonly blogCacheRepository: BlogCacheRepository
  ) {}

  @OnEvent('ml.model.ready')
  onModelReady(): void {
    this.logger.log('🚀 Blog 초기 로딩 시작 (ML 모델 준비 완료)');

    // 백그라운드 전체 로딩 (캐싱 + exists set 추가 동시 처리)
    this.loadAllBlogs().catch((error) => {
      this.logger.error('Blog 초기 로딩 실패:', error);
    });
  }

  private async loadAllBlogs(): Promise<void> {
    try {
      const blogs = await this.blogRepository.getAll();

      this.logger.log(`📦 총 ${blogs.length}개 Blog 로딩 중...`);

      let loaded = 0;

      for (const blog of blogs) {
        // 1. Redis에 캐싱
        await this.blogCacheRepository.saveBlogCacheById(
          blog.id,
          this.convertToCachedBlogType(blog)
        );

        // 2. blog:exists:set에 추가 (캐싱과 동시에 처리)
        await this.blogCacheRepository.addBlogToExistsSet(blog.id);

        loaded++;

        if (loaded % 100 === 0) {
          this.logger.log(`📊 Blog 로딩 진행: ${loaded}/${blogs.length}`);
        }
      }

      this.logger.log(`✅ Blog 로딩 완료: ${loaded}개 (임베딩 생성 안 함)`);
    } catch (error) {
      this.logger.error('Blog 로딩 중 에러 발생:', error);
      throw error;
    }
  }

  // BlogEntity를 CachedBlog 타입으로 변환
  private convertToCachedBlogType(blog: BlogEntity) {
    return {
      id: blog.id,
      userId: blog.userId,
      domain: blog.domain,
      name: blog.name,
      blogKey: blog.blogKey,
      verified: blog.verified,
      createdAt: blog.createdAt.toISOString(),
      // embedding은 Worker가 나중에 추가
    };
  }

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

  async getMyBlogKey(
    userId: number
  ): Promise<{ blogKey: string; domain: string }> {
    if (await this.userRepository.verifyRole(userId, UserRole.ADVERTISER)) {
      throw new BadRequestException('잘못된 Role의 접근입니다.');
    }
    const blog = await this.blogRepository.findByUserId(userId);

    if (!blog) {
      throw new NotFoundException('사용자의 블로그가 존재하지 않습니다.');
    }

    return { blogKey: blog.blogKey, domain: blog.domain };
  }
}
