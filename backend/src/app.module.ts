import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60초
        limit: 100, // IP당 100회
      },
    ]),
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
