import { Controller, Get, Req } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { successResponse } from 'src/common/response/success-response';
import { type AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('advertiser')
export class AdvertiserController {
  constructor(private readonly advertiserService: AdvertiserService) {}

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;

    const stats = await this.advertiserService.getDashboardStats(userId);
    return successResponse(stats, '광고주 대시보드 통계입니다.');
  }
}
