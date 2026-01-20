import { Module } from '@nestjs/common';
import { CampaignRepository } from './repository/campaign.repository';
import { JsonCampaignRepository } from './repository/json-campaign.repository';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CampaignCronService } from './campaign-cron.service';

@Module({
  controllers: [CampaignController],
  providers: [
    CampaignService,
    CampaignCronService,
    { provide: CampaignRepository, useClass: JsonCampaignRepository },
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
