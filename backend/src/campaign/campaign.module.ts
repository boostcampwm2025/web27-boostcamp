import { Module } from '@nestjs/common';
import { CampaignRepository } from './repository/campaign.repository';
import { JsonCampaignRepository } from './repository/json-campaign.repository';
// import { TypeOrmCampaignRepository } from './repository/typeorm-campaign.repository';

@Module({
  providers: [
    { provide: CampaignRepository, useClass: JsonCampaignRepository },
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
