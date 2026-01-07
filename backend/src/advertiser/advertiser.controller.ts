import { Controller, Get } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { successResponse } from 'src/common/response/success-response';

@Controller('advertiser')
export class AdvertiserController {
  constructor(private readonly advertiserService: AdvertiserService) {}
  @Get()
  getDashboardStats() {
    const MOCK_USER_ID = 1;
    const userId = MOCK_USER_ID;
    const stats = this.advertiserService.getDashboardStats(userId);
    return successResponse(stats, '광고주 대시보드 통계입니다.');
  }
}
