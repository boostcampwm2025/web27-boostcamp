import { Module } from '@nestjs/common';
import { AdvertiserController } from './advertiser.controller';

@Module({
  controllers: [AdvertiserController],
})
export class AdvertiserModule {}
