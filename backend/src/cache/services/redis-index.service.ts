// import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { REDIS_CLIENT } from 'src/redis/redis.module';
// // eslint-disable-next-line @typescript-eslint/consistent-type-imports
// import { Redis } from 'ioredis';

// @Injectable()
// export class RedisIndexService implements OnModuleInit {
//   private readonly logger = new Logger(RedisIndexService.name);

//   constructor(@Inject(REDIS_CLIENT) private readonly redis: any) {}

//   async onModuleInit() {
//     this.logger.log('Initializing Redis Indices...');
//     await this.createCampaignIndex();
//     await this.createBlogIndex();
//   }

//   // Campaign 인덱스 생성 (Vector Search 포함)
//   async createCampaignIndex() {
//     try {
//       await this.redis.call(
//         'FT.CREATE',
//         'campaign_idx',
//         'ON',
//         'JSON',
//         'PREFIX',
//         '1',
//         'campaign:',
//         'SCHEMA',
//         '$.id',
//         'AS',
//         'id',
//         'TEXT',
//         '$.userId',
//         'AS',
//         'userId',
//         'NUMERIC',
//         '$.status',
//         'AS',
//         'status',
//         'TAG',
//         '$.dailySpent',
//         'AS',
//         'dailySpent',
//         'NUMERIC',
//         '$.dailyBudget',
//         'AS',
//         'dailyBudget',
//         'NUMERIC',
//         '$.maxCpc',
//         'AS',
//         'maxCpc',
//         'NUMERIC',
//         '$.isHighIntent',
//         'AS',
//         'isHighIntent',
//         'TAG',
//         '$.startDate',
//         'AS',
//         'startDate',
//         'TEXT', // 날짜 범위 검색을 위해 NUMERIC(timestamp)으로 변환 고려 필요. 일단 필터링은 후처리 또는 TEXT
//         '$.endDate',
//         'AS',
//         'endDate',
//         'TEXT',
//         '$.embedding',
//         'AS',
//         'embedding',
//         'VECTOR',
//         'HNSW',
//         '6',
//         'TYPE',
//         'FLOAT32',
//         'DIM',
//         '384',
//         'DISTANCE_METRIC',
//         'COSINE'
//       );
//       this.logger.log('Created campaign_idx');
//     } catch (error: any) {
//       if (error?.message?.includes('Index already exists')) {
//         this.logger.log('campaign_idx already exists');
//       } else {
//         this.logger.error('Failed to create campaign_idx:', error);
//       }
//     }
//   }

//   // Blog 인덱스 생성
//   async createBlogIndex() {
//     try {
//       await this.redis.call(
//         'FT.CREATE',
//         'blog_idx',
//         'ON',
//         'JSON',
//         'PREFIX',
//         '1',
//         'blog:',
//         'SCHEMA',
//         '$.id',
//         'AS',
//         'id',
//         'TEXT',
//         '$.blogKey',
//         'AS',
//         'blogKey',
//         'TAG'
//       );
//       this.logger.log('Created blog_idx');
//     } catch (error: any) {
//       if (error?.message?.includes('Index already exists')) {
//         this.logger.log('blog_idx already exists');
//       } else {
//         this.logger.error('Failed to create blog_idx:', error);
//       }
//     }
//   }
// }
