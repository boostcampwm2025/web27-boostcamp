import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { BlogService } from './blog.service';
import { successResponse } from 'src/common/response/success-response';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: AuthenticatedRequest
  ) {
    const { blogName, blogUrl } = createBlogDto;
    const { userId } = req.user;

    const blogKey = await this.blogService.createBlog({
      blogName,
      blogUrl,
      userId,
    });

    return successResponse({ blogKey }, 'blogKey가 성공적으로 반환되었습니다.');
  }

  @Get('me/exists')
  async getMyBlogExists(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    const exists = await this.blogService.getMyBlogExists(userId);
    return successResponse(
      { exists },
      '블로그 등록 여부가 성공적으로 반환되었습니다.'
    );
  }
}
