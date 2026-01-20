import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
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
}
