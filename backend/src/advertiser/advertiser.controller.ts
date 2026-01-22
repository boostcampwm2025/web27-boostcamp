import { Controller, Get } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { successResponse } from 'src/common/response/success-response';

@Controller('advertiser')
export class AdvertiserController {
  constructor(private readonly advertiserService: AdvertiserService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    // TODO: userId 매개변수로 넘겨 받기 필요
    const MOCK_USER_ID = 1;
    const userId = MOCK_USER_ID;

    const stats = await this.advertiserService.getDashboardStats(userId);
    return successResponse(stats, '광고주 대시보드 통계입니다.');
  }
}
