import { Controller, Get, Query, Req } from '@nestjs/common';
import { BidLogService } from './bid-log.service';
import { BidLogDataDto } from './dto/bid-log-response.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import {
  successResponse,
  type SuccessResponse,
} from '../common/response/success-response';

@Controller('advertiser/bids')
export class BidLogController {
  constructor(private readonly bidLogService: BidLogService) {}

  @Get('realtime')
  async getRealtimeBids(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<SuccessResponse<BidLogDataDto>> {
    const userId = req.user.userId;
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    const data = await this.bidLogService.getRealtimeBidLogs(
      userId,
      parsedLimit,
      parsedOffset,
      startDate,
      endDate
    );

    return successResponse(data, '광고주 실시간 입찰 로그입니다.');
  }
}
