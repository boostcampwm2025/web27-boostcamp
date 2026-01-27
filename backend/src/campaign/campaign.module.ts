import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignRepository } from './repository/campaign.repository.interface';
import { TypeOrmCampaignRepository } from './repository/typeorm-campaign.repository';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CampaignCronService } from './campaign-cron.service';
import { CampaignEntity } from './entities/campaign.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { LogModule } from '../log/log.module';
import { ImageModule } from '../image/image.module';
import { CampaignCacheRepository } from './repository/campaign.cache.repository.interface';
import { RedisCampaignCacheRepository } from './repository/redis-campaign.cache.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignEntity, TagEntity]),
    LogModule,
    ImageModule,
    UserModule,
  ],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    CampaignCronService,
    { provide: CampaignRepository, useClass: TypeOrmCampaignRepository },
    {
      provide: CampaignCacheRepository,
      useClass: RedisCampaignCacheRepository,
    },
  ],
  exports: [CampaignRepository],
})
export class CampaignModule {}
