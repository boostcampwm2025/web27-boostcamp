import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { BlogRepository } from '../../blog/repository/blog.repository.interface';
import type { BlogEntity } from '../../blog/entities/blog.entity';

interface RequestWithBlog extends Request {
  blog?: BlogEntity; // TypeORM 엔티티로 변경
}

@Injectable()
export class BlogKeyValidationGuard implements CanActivate {
  private readonly logger = new Logger(BlogKeyValidationGuard.name);

  constructor(private readonly blogRepository: BlogRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithBlog>();
    const { blogKey } = request.body as { blogKey?: string };

    // blogKey 누락 체크
    if (!blogKey) {
      this.logger.warn('blogKey 누락된 요청 시도', {
        ip: request.ip,
        url: request.url,
      });
      throw new BadRequestException('blogKey가 필요합니다.');
    }

    // blogKey 검증 (DB 조회)
    let blog: BlogEntity | null;
    try {
      blog = await this.blogRepository.findByBlogKey(blogKey);
    } catch (error) {
      this.logger.error('blogKey 조회 중 DB 오류 발생', {
        blogKey,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new InternalServerErrorException(
        '블로그 정보 조회 중 오류가 발생했습니다.'
      );
    }

    if (!blog) {
      this.logger.warn('미등록 blogKey 요청 차단', {
        blogKey,
        ip: request.ip,
        url: request.url,
        timestamp: new Date().toISOString(),
      });
      throw new ForbiddenException(
        '등록되지 않은 blogKey입니다. 관리자에게 문의하세요.'
      );
    }

    // 요청 객체에 blog 정보 첨부 (후속 로직에서 사용 가능)
    request.blog = blog;

    this.logger.log(`blogKey 검증 성공: ${blogKey} (${blog.name})`);
    return true;
  }
}
