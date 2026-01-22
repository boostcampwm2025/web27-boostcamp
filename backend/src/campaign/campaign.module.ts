import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignRepository } from './repository/campaign.repository';
import { TypeOrmCampaignRepository } from './repository/typeorm-campaign.repository';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CampaignCronService } from './campaign-cron.service';
import { CampaignEntity } from './entities/campaign.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { LogModule } from '../log/log.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity, TagEntity]),
    LogModule,
    ImageModule,
  ],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    CampaignCronService,
    { provide: CampaignRepository, useClass: TypeOrmCampaignRepository },
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
