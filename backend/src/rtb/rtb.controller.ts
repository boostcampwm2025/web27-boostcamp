import { Controller, Post, Body, Get } from '@nestjs/common';
import { RTBService } from './rtb.service';
import { plainToInstance } from 'class-transformer';

import { RTBRequestDto } from './dto/rtb-request.dto';
import { RTBResponseDto } from './dto/rtb-response.dto';
import type { DecisionContext } from './types/decision.types';

import { Logger } from '@nestjs/common';
import { BidLogRepository } from './repositories/bid-log.repository';
import { successResponse } from 'src/common/response/success-response';

@Controller('sdk')
export class RTBController {
  private readonly logger = new Logger(RTBController.name);

  constructor(
    private readonly rtbService: RTBService,
    private readonly bidLogRepository: BidLogRepository
  ) {}

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

  @Get('debug/bidlogs')
  getBidLogs() {
    const bidLogs = this.bidLogRepository.getAll();
    return successResponse(
      {
        bidLogs,
        stats: {
          total: this.bidLogRepository.count(),
          winCount: bidLogs.filter((log) => log.status === 'WIN').length,
          lossCount: bidLogs.filter((log) => log.status === 'LOSS').length,
        },
      },
      'BidLog 조회 성공'
    );
  }
}
