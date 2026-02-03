import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { LogModule } from 'src/log/log.module';
import { CacheModule } from 'src/cache/cache.module';
import { BlogModule } from 'src/blog/blog.module';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [LogModule, CacheModule, BlogModule, CampaignModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
