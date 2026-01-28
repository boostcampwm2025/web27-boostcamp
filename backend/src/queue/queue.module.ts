// import { Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bullmq';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { EmbeddingWorker } from './workers/embedding.worker';
// import { RTBModule } from 'src/rtb/rtb.module'; // XenovaMLEngine 사용을 위해
// import { CacheModule } from 'src/cache/cache.module'; // CampaignCacheService 사용을 위해
// import { RedisModule } from 'src/redis/redis.module';

// @Module({
//   imports: [
//     ConfigModule,
//     RTBModule,
//     CacheModule,
//     RedisModule,
//     BullModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         connection: {
//           host: configService.get('REDIS_HOST'),
//           port: configService.get('REDIS_PORT'),
//           // password: configService.get('REDIS_PASSWORD'),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//     BullModule.registerQueue({
//       name: 'embedding-queue',
//     }),
//   ],
//   providers: [EmbeddingWorker],
//   exports: [BullModule],
// })
// export class QueueModule {}
