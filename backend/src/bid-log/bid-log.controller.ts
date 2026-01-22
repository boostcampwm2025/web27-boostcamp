import { Controller, Get, Query, Req } from '@nestjs/common';
import { BidLogService } from './bid-log.service';
import { BidLogResponseDto } from './dto/bid-log-response.dto';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('advertiser/bids')
export class BidLogController {
  constructor(private readonly bidLogService: BidLogService) {}

  @Get('realtime')
  async getRealtimeBids(
    @Req() req: AuthenticatedRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<BidLogResponseDto> {
    const userId = req.user.userId;
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.bidLogService.getRealtimeBidLogs(
      userId,
      parsedLimit,
      parsedOffset
    );
  }
}
