import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';
import { GetUserId } from 'src/auth/decorators/get-user-id.decorator';
import { EarningsHistoryQueryDto } from './dto/earnings-history-query.dto';
import { successResponse } from 'src/common/response/success-response';

@Controller('publisher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PUBLISHER)
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get('earnings/summary')
  async getEarningsSummary(@GetUserId() userId: number) {
    const data = await this.publisherService.getEarningsSummary(userId);
    return successResponse(data, '퍼블리셔 수익 요약을 조회했습니다.');
  }

  @Get('earnings/history')
  async getEarningsHistory(
    @GetUserId() userId: number,
    @Query() query: EarningsHistoryQueryDto
  ) {
    const { offset = 0, limit = 10 } = query;
    const data = await this.publisherService.getEarningsHistory(
      userId,
      offset,
      limit
    );
    return successResponse(data, '퍼블리셔 수익 히스토리를 조회했습니다.');
  }
}
