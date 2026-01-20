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
import { Request } from 'express';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignListDto } from './dto/get-campaign-list.dto';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';

@Controller('campaigns')
@UseGuards(JwtCookieGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async createCampaign(
    @Req() req: Request & { user: { userId: number } },
    @Body() dto: CreateCampaignDto
  ) {
    return this.campaignService.createCampaign(req.user.userId, dto);
  }

  @Get()
  async getCampaignList(
    @Req() req: Request & { user: { userId: number } },
    @Query() dto: GetCampaignListDto
  ) {
    return this.campaignService.getCampaignList(req.user.userId, dto);
  }

  @Get(':id')
  async getCampaignById(
    @Req() req: Request & { user: { userId: number } },
    @Param('id') id: string
  ) {
    return this.campaignService.getCampaignById(id, req.user.userId);
  }

  @Put(':id')
  async updateCampaign(
    @Req() req: Request & { user: { userId: number } },
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto
  ) {
    return this.campaignService.updateCampaign(id, req.user.userId, dto);
  }

  @Delete(':id')
  async deleteCampaign(
    @Req() req: Request & { user: { userId: number } },
    @Param('id') id: string
  ) {
    await this.campaignService.deleteCampaign(id, req.user.userId);
    return { message: '캠페인이 삭제되었습니다.' };
  }
}
