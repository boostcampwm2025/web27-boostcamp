import { Injectable } from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';

@Injectable()
export class SdkService {
  logCampaignView(dto: CreateViewLogDto) {
    const { auctionId, campaginId, positionRatio } = dto;

    
  }
}
