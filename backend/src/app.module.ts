import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RTBModule } from './rtb/rtb.module';
import { ClickModule } from './click/click.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { LogModule } from './log/log.module';
import { CacheModule } from './cache/cache.module';
import { CampaignModule } from './campaign/campaign.module';
import { UserModule } from './user/user.module';
import { SdkModule } from './sdk/sdk.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClickModule, 
    RTBModule,
    SdkModule,
    AdvertiserModule,
    LogModule,
    CacheModule,
    CampaignModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
