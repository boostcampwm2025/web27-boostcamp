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

  // 테스트용 -- 테스트용 --
  // @Public()
  // @Post('test/cache/save')
  // async testSaveBlogCache(): Promise<
  //   SuccessResponse<{ message: string; data: CachedBlog }>
  // > {
  //   const mockBlog: CachedBlog = {
  //     id: 999,
  //     userId: 1,
  //     domain: 'test-blog.tistory.com',
  //     name: '테스트 블로그',
  //     blogKey: 'test-blog-key-12345',
  //     verified: true,
  //     createdAt: new Date().toISOString(),
  //   };

  //   await this.blogCacheRepository.saveBlogCacheById(999, mockBlog);

  //   return successResponse(
  //     { message: 'Redis 캐시 저장 완료', data: mockBlog },
  //     'Redis JSON.SET 테스트 성공'
  //   );
  // }

  // @Public()
  // @Get('test/cache/find/:id')
  // async testFindBlogCache(
  //   @Req() req: { params: { id: string } }
  // ): Promise<SuccessResponse<{ found: boolean; data: CachedBlog | null }>> {
  //   const id = Number(req.params.id);
  //   const cached = await this.blogCacheRepository.findBlogCacheById(id);

  //   return successResponse(
  //     { found: !!cached, data: cached },
  //     cached ? 'Redis 캐시 조회 성공' : '캐시 미스'
  //   );
  // }

  // @Public()
  // @Get('test/cache/exists/:id')
  // async testExistsBlogCache(
  //   @Req() req: { params: { id: string } }
  // ): Promise<SuccessResponse<{ exists: boolean }>> {
  //   const id = Number(req.params.id);
  //   const exists = await this.blogCacheRepository.existsBlogCacheById(id);

  //   return successResponse({ exists }, 'Redis SISMEMBER 테스트 성공');
  // }

  // @Public()
  // @Post('test/cache/update-embedding/:id')
  // async testUpdateEmbedding(
  //   @Req() req: { params: { id: string } }
  // ): Promise<SuccessResponse<{ message: string }>> {
  //   const id = Number(req.params.id);
  //   const mockEmbedding = Array(384)
  //     .fill(0)
  //     .map(() => Math.random());

  //   await this.blogCacheRepository.updateBlogEmbeddingById(id, mockEmbedding);

  //   return successResponse(
  //     { message: `Blog ${id}의 임베딩 업데이트 완료 (384차원)` },
  //     'Redis JSON.SET $.embedding 테스트 성공'
  //   );
  // }

  // @Public()
  // @Post('test/cache/delete/:id')
  // async testDeleteBlogCache(
  //   @Req() req: { params: { id: string } }
  // ): Promise<SuccessResponse<{ message: string }>> {
  //   const id = Number(req.params.id);
  //   await this.blogCacheRepository.deleteBlogCacheById(id);

  //   return successResponse(
  //     { message: `Blog ${id} 캐시 삭제 완료` },
  //     'Redis DEL + SREM 테스트 성공'
  //   );
  // }
}
