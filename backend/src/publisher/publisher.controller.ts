import { Controller, Get, Query, Req } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { EarningsHistoryQueryDto } from './dto/earnings-history-query.dto';
import { successResponse } from 'src/common/response/success-response';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('earnings/summary')
  async getEarningsSummary(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    const data = await this.publisherService.getEarningsSummary(userId);
    return successResponse(data, '퍼블리셔 수익 요약을 조회했습니다.');
  }

  @Get('earnings/history')
  async getEarningsHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: EarningsHistoryQueryDto
  ) {
    const { userId } = req.user;
    const { offset = 0, limit = 10 } = query;
    const data = await this.publisherService.getEarningsHistory(
      userId,
      offset,
      limit
    );
    return successResponse(data, '퍼블리셔 수익 히스토리를 조회했습니다.');
  }
}
