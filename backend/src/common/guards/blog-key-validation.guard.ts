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

export interface BlogKeyValidatedRequest extends Request {
  blog?: BlogEntity; // TypeORM 엔티티로 변경
  visitorId?: string;
}

function normalizeHostname(hostname: string): string {
  const lower = hostname.trim().toLowerCase();
  const withoutTrailingDot = lower.endsWith('.') ? lower.slice(0, -1) : lower;
  return withoutTrailingDot.startsWith('www.')
    ? withoutTrailingDot.slice('www.'.length)
    : withoutTrailingDot;
}

@Injectable()
export class BlogKeyValidationGuard implements CanActivate {
  private readonly logger = new Logger(BlogKeyValidationGuard.name);

  constructor(private readonly blogRepository: BlogRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<BlogKeyValidatedRequest>();
    const { blogKey, postUrl } = request.body as {
      blogKey?: string;
      postUrl?: string;
    };

    // blogKey 누락 체크
    if (!blogKey) {
      this.logger.warn('blogKey 누락된 요청 시도', {
        ip: request.ip,
        url: request.url,
      });
      throw new BadRequestException('blogKey가 필요합니다.');
    }

    if (!postUrl) {
      this.logger.warn('postUrl 누락된 요청 시도', {
        ip: request.ip,
        url: request.url,
      });
      throw new BadRequestException('postUrl이 필요합니다.');
    }

    let requestDomain: string;
    try {
      requestDomain = new URL(postUrl).hostname;
    } catch {
      throw new BadRequestException('유효한 postUrl이 필요합니다.');
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

    const { domain } = blog;
    const normalizedRequestDomain = normalizeHostname(requestDomain);
    const normalizedBlogDomain = normalizeHostname(domain);

    if (normalizedRequestDomain !== normalizedBlogDomain) {
      this.logger.warn('blogKey 도메인 불일치', {
        blogKey,
        requestDomain,
        blogDomain: domain,
        normalizedRequestDomain,
        normalizedBlogDomain,
        ip: request.ip,
        url: request.url,
      });
      throw new ForbiddenException(
        '요청 도메인이 blogKey의 도메인과 일치하지 않습니다.'
      );
    }

    const visitorId = request.cookies?.visitor_id as string | undefined;

    if (visitorId) {
      request.visitorId = visitorId;
    }
    // 요청 객체에 blog 정보 첨부 (후속 로직에서 사용 가능)
    request.blog = blog;

    this.logger.log(`blogKey 검증 성공: ${blogKey} (${blog.name})`);
    return true;
  }
}
