import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SdkModule } from './sdk/sdk.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SdkModule,
    AdvertiserModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
