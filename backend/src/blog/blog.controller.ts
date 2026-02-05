import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { BlogService } from './blog.service';
import {
  SuccessResponse,
  successResponse,
} from 'src/common/response/success-response';
import { BlogCacheRepository } from './repository/blog.cache.repository.interface';
// import { CachedBlog } from './types/blog.type';
// import { Public } from 'src/auth/decorators/public.decorator';

@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly blogCacheRepository: BlogCacheRepository
  ) {}

  @Post()
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: AuthenticatedRequest
  ): Promise<SuccessResponse<{ blogKey: string }>> {
    const { blogName, blogUrl } = createBlogDto;
    const { userId } = req.user;

    const blogKey = await this.blogService.createBlog({
      blogName,
      blogUrl,
      userId,
    });

    return successResponse(
      { blogKey },
      '블로그 키가 성공적으로 반환되었습니다.'
    );
  }

  @Get('me/exists')
  async getMyBlogExists(
    @Req() req: AuthenticatedRequest
  ): Promise<SuccessResponse<{ exists: boolean }>> {
    const { userId } = req.user;
    const exists = await this.blogService.getMyBlogExists(userId);
    return successResponse(
      { exists },
      '블로그 등록 여부가 성공적으로 반환되었습니다.'
    );
  }

  @Get('me/key')
  async getMyBlogKey(
    @Req() req: AuthenticatedRequest
  ): Promise<SuccessResponse<{ blogKey: string; domain: string }>> {
    const { userId } = req.user;
    const { blogKey, domain } = await this.blogService.getMyBlogKey(userId);
    return successResponse(
      { blogKey, domain },
      '블로그 키가 성공적으로 반환되었습니다.'
    );
  }
}
