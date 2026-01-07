import { Module } from '@nestjs/common';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserService } from './advertiser.service';

@Module({
  controllers: [AdvertiserController],
  providers: [AdvertiserService],
})
export class AdvertiserModule {}
