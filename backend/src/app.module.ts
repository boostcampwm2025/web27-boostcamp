import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';

import { RTBModule } from './rtb/rtb.module';
import { BidLogModule } from './bid-log/bid-log.module';
import { SdkModule } from './sdk/sdk.module';
import { AdvertiserModule } from './advertiser/advertiser.module';
import { LogModule } from './log/log.module';
import { CacheModule } from './cache/cache.module';
import { CampaignModule } from './campaign/campaign.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env 파일을 전역 설정으로 사용
    RTBModule,

    // 팩토리 함수 사용해서 typeORM 설정 비동기 로드
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService),
    }),

    BidLogModule,
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
