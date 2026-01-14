import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RTBModule } from './rtb/rtb.module';
import { BidLogModule } from './bid-log/bid-log.module';
import { SdkModule } from './sdk/sdk.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { LogModule } from './log/log.module';
import { CacheModule } from './cache/cache.module';
import { CampaignModule } from './campaign/campaign.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RTBModule,
    BidLogModule,
    SdkModule,
    AdvertiserModule,
    LogModule,
    CacheModule,
    CampaignModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
