import { Controller, Get, Query } from '@nestjs/common';
import { BidLogService } from './bid-log.service';
import { BidLogResponseDto } from './dto/bid-log-response.dto';

@Controller('advertiser/bids')
export class BidLogController {
  constructor(private readonly bidLogService: BidLogService) {}

  @Get('realtime')
  async getRealtimeBids(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<BidLogResponseDto> {
    // TODO: userId 넘겨받기 필요
    const parsedLimit = limit ? parseInt(limit, 10) : 3;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.bidLogService.getRealtimeBidLogs(parsedLimit, parsedOffset);
  }
}
