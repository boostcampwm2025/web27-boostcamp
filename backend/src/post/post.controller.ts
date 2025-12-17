import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { PostService } from './post.service';
import { DecisionRequestDto } from './dto/decision-request.dto';
import { DecisionResponseDto } from './dto/decision-response.dto';

@Controller('api')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('decision')
  decision(@Body() dto: DecisionRequestDto): DecisionResponseDto {
    return this.postService.decision(dto);
  }

  /**
   * Mock Redirect API (임시)
   * 광고 클릭 시 실제 광고 URL로 리디렉션
   */
  @Get('redirect/:campaignId')
  mockRedirect(@Param('campaignId') campaignId: string, @Res() res: Response) {
    return this.postService.mockRedirect(campaignId, res);
  }
}
