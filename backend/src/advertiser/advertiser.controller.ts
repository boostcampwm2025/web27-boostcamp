import { Controller, Get, Post, Req, Body, Query } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { successResponse } from 'src/common/response/success-response';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';
import { ChargeCreditDto, GetCreditHistoryDto } from './dto/credit.dto';

@Controller('advertiser')
export class AdvertiserController {
  constructor(private readonly advertiserService: AdvertiserService) {}

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    const stats = await this.advertiserService.getDashboardStats(userId);
    return successResponse(stats, '광고주 대시보드 통계입니다.');
  }

  @Post('credit/charge')
  async chargeCredit(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChargeCreditDto
  ) {
    const { userId } = req.user;
    const { amount } = body;

    const result = await this.advertiserService.chargeCredit(userId, amount);

    return successResponse(
      {
        balanceAfter: result.balanceAfter,
        amount,
        historyId: result.historyId,
      },
      '크레딧이 충전되었습니다'
    );
  }

  @Get('credit/history')
  async getCreditHistory(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetCreditHistoryDto
  ) {
    const { userId } = req.user;
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    const result = await this.advertiserService.getCreditHistory(
      userId,
      limit,
      offset
    );

    return successResponse(result, '크레딧 사용 내역 조회 성공');
  }
}
