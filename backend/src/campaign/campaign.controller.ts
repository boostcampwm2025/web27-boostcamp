import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignCronService } from './campaign-cron.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignListDto } from './dto/get-campaign-list.dto';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import type { AuthenticatedRequest } from '../types/authenticated-request';
import { successResponse } from '../common/response/success-response';
import { Public } from '../auth/decorators/public.decorator';

@Controller('campaigns')
@UseGuards(JwtCookieGuard)
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly campaignCronService: CampaignCronService
  ) {}

  @Post()
  async createCampaign(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCampaignDto
  ) {
    const campaign = await this.campaignService.createCampaign(
      req.user.userId,
      dto
    );
    return successResponse(campaign, '캠페인이 생성되었습니다.');
  }

  @Get()
  async getCampaignList(
    @Req() req: AuthenticatedRequest,
    @Query() dto: GetCampaignListDto
  ) {
    const result = await this.campaignService.getCampaignList(
      req.user.userId,
      dto
    );
    return successResponse(result, '캠페인 목록을 조회했습니다.');
  }

  @Get(':id')
  async getCampaignById(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string
  ) {
    const campaign = await this.campaignService.getCampaignById(
      id,
      req.user.userId
    );
    return successResponse(campaign, '캠페인을 조회했습니다.');
  }

  @Get(':id/click-history')
  async getClickHistory(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    const history = await this.campaignService.getClickHistory(
      id,
      req.user.userId,
      limit ? Number(limit) : 5,
      offset ? Number(offset) : 0
    );
    return successResponse(history, '클릭 히스토리를 조회했습니다.');
  }

  @Put(':id')
  async updateCampaign(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto
  ) {
    const campaign = await this.campaignService.updateCampaign(
      id,
      req.user.userId,
      dto
    );
    return successResponse(campaign, '캠페인이 수정되었습니다.');
  }

  @Delete(':id')
  async deleteCampaign(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string
  ) {
    await this.campaignService.deleteCampaign(id, req.user.userId);
    return successResponse(null, '캠페인이 삭제되었습니다.');
  }

  @Post('manual-reset')
  @Public()
  async manualReset() {
    const result = await this.campaignCronService.manualReset();
    return successResponse(
      result,
      '캠페인 상태 및 일일 예산이 리셋되었습니다.'
    );
  }

  @Post('migrate-spent')
  @Public()
  async migrateSpent() {
    const migratedCount =
      await this.campaignCronService.migrateAllSpentFromClickLog();
    return successResponse(
      { migratedCount },
      `전체 기간 Spent 마이그레이션 완료: ${migratedCount}개 캠페인`
    );
  }
}
