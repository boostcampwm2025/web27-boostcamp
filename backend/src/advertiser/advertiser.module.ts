import { Module } from '@nestjs/common';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserService } from './advertiser.service';
import { UserModule } from 'src/user/user.module';
import { CampaignModule } from 'src/campaign/campaign.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [UserModule, CampaignModule, LogModule],
  controllers: [AdvertiserController],
  providers: [AdvertiserService],
})
export class AdvertiserModule {}
