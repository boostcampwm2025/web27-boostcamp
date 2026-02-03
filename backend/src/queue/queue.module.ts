import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RTBModule } from 'src/rtb/rtb.module';
import { CampaignModule } from 'src/campaign/campaign.module';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    ConfigModule,
    RTBModule,
    CampaignModule,
    BlogModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 16379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'embedding-queue',
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
