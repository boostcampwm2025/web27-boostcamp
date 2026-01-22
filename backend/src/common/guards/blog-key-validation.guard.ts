import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { getBlogByKey } from '../utils/blog.utils';
import type { MockBlog } from '../constants';

interface RequestWithBlog extends Request {
  blog?: MockBlog; // TODO: Mock 인터페이스 수정 필요
}

@Injectable()
export class BlogKeyValidationGuard implements CanActivate {
  private readonly logger = new Logger(BlogKeyValidationGuard.name);

  canActivate(context: ExecutionContext): boolean {
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

    // TODO: Blog 키 검증 로직 수정 필요
    // blogKey 검증
    const blog = getBlogByKey(blogKey);

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
