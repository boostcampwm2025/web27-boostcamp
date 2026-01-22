import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { BlogService } from './blog.service';
import {
  SuccessResponse,
  successResponse,
} from 'src/common/response/success-response';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

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
  ): Promise<SuccessResponse<{ blogKey: string }>> {
    const { userId } = req.user;
    const blogKey = await this.blogService.getMyBlogKey(userId);
    return successResponse(
      { blogKey },
      '블로그 키가 성공적으로 반환되었습니다.'
    );
  }
}
