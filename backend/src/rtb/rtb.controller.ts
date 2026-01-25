import { Controller, Post, Body, UseGuards, Res, Req } from '@nestjs/common';
import { RTBService } from './rtb.service';
import { plainToInstance } from 'class-transformer';

import { RTBRequestDto } from './dto/rtb-request.dto';
import { RTBResponseDto } from './dto/rtb-response.dto';
import type { DecisionContext } from './types/decision.types';

import { Logger } from '@nestjs/common';
import {
  BlogKeyValidationGuard,
  type RequestWithBlog,
} from '../common/guards/blog-key-validation.guard';
import { Public } from '../auth/decorators/public.decorator';
import { type Response } from 'express';
import { randomUUID } from 'crypto';

@Controller('sdk')
@Public()
@UseGuards(BlogKeyValidationGuard)
export class RTBController {
  private readonly logger = new Logger(RTBController.name);

  constructor(private readonly rtbService: RTBService) {}

  @Post('decision')
  async getDecision(
    @Body() body: RTBRequestDto,
    @Req() req: RequestWithBlog,
    @Res({ passthrough: true }) res: Response
  ) {
    const visitorId = req.visitorId;
    console.log(`visitorId:${visitorId}`); // todo: 제거

    if (!visitorId) {
      res.cookie('visitor_id', randomUUID(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1년
        path: '/sdk',
      });
    }

    const context: DecisionContext = {
      blogKey: body.blogKey,
      tags: body.tags,
      postUrl: body.postUrl,
      behaviorScore: body.behaviorScore,
      isHighIntent: body.isHighIntent,
    };

    const result = await this.rtbService.runAuction(context);

    result.data?.candidates?.forEach((candidate) => {
      const eachCandidateLog = {
        id: candidate.id,
        title: candidate.title.slice(0, 10) + '...',
        tags: candidate.tags,
        score: candidate.score,
      };

      this.logger.log(JSON.stringify(eachCandidateLog));
    });

    // Expose 데코레이터가 붙은 속성만 포함하여 DTO 인스턴스로 변환
    return plainToInstance(RTBResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
