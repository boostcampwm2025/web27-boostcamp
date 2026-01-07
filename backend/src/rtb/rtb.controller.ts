import { Controller, Post, Body } from '@nestjs/common';
import { RTBService } from './rtb.service';
import { plainToInstance } from 'class-transformer';

import { RTBRequestDto } from './dto/rtb-request.dto';
import { RTBResponseDto } from './dto/rtb-response.dto';
import type { DecisionContext } from './types/decision.types';

@Controller('sdk')
export class RTBController {
  constructor(private readonly rtbService: RTBService) {}

  @Post('decision')
  async getDecision(@Body() body: RTBRequestDto) {
    const context: DecisionContext = {
      campaignId: body.campaignId,
      tags: body.tags,
      url: body.url,
    };

    const result = await this.rtbService.runAuction(context);

    // Expose 데코레이터가 붙은 속성만 포함하여 DTO 인스턴스로 변환
    return plainToInstance(RTBResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
