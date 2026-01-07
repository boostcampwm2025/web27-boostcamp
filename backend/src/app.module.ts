import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RTBModule } from './rtb/rtb.module';
import { ClickModule } from './click/click.module';
import { SdkModule } from './sdk/sdk.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { LogModule } from './log/log.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RTBModule,
    ClickModule,
    SdkModule,
    AdvertiserModule,
    LogModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
