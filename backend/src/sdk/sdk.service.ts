import { Injectable } from '@nestjs/common';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { LogRepository } from 'src/log/repository/log.repository';

@Injectable()
export class SdkService {
  constructor(private readonly logRepository: LogRepository) {}
  recordView(dto: CreateViewLogDto) {
    const { auctionId, campaignId, blogKey, positionRatio } = dto;

    this.logRepository.saveViewLog({});
  }
}
