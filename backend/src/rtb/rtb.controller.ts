import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RTBService } from './rtb.service';
import { plainToInstance } from 'class-transformer';

import { RTBRequestDto } from './dto/rtb-request.dto';
import { RTBResponseDto } from './dto/rtb-response.dto';
import type { DecisionContext } from './types/decision.types';

import { Logger } from '@nestjs/common';
import { BlogKeyValidationGuard } from '../common/guards/blog-key-validation.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('sdk')
@Public()
@UseGuards(BlogKeyValidationGuard)
export class RTBController {
  private readonly logger = new Logger(RTBController.name);

  constructor(private readonly rtbService: RTBService) {}

  @Post('decision')
  async getDecision(@Body() body: RTBRequestDto) {
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
