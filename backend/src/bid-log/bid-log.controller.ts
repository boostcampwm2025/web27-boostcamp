import { Controller, Get, Query, Req, Sse, MessageEvent } from '@nestjs/common';
import { BidLogService } from './bid-log.service';
import { BidLogDataDto } from './dto/bid-log-response.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import {
  successResponse,
  type SuccessResponse,
} from '../common/response/success-response';
import { Observable } from 'rxjs';

@Controller('advertiser/bids')
export class BidLogController {
  constructor(private readonly bidLogService: BidLogService) {}

  @Get('realtime')
  async getRealtimeBids(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('campaignIds') campaignIds?: string
  ): Promise<SuccessResponse<BidLogDataDto>> {
    const userId = req.user.userId;
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    const parsedCampaignIds = campaignIds
      ? campaignIds.split(',').map((id) => parseInt(id.trim(), 10))
      : undefined;

    const data = await this.bidLogService.getRealtimeBidLogs(
      userId,
      parsedLimit,
      parsedOffset,
      startDate,
      endDate,
      parsedCampaignIds
    );

    return successResponse(data, '광고주 실시간 입찰 로그입니다.');
  }

  @Sse('stream')
  streamBids(@Req() req: AuthenticatedRequest): Observable<MessageEvent> {
    const userId = req.user.userId;
    return this.bidLogService.subscribeToBidEvents(userId);
  }
}
