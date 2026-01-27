import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@keyv/redis';
import Redis from 'ioredis';
import { REDIS_CLIENT, IOREDIS_CLIENT } from './redis.constant';
import type { AppRedisClient, AppIORedisClient } from './redis.type';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ): Promise<AppRedisClient> => {
        const logger = new Logger(REDIS_CLIENT.description ?? 'REDIS_CLIENT');

        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);
        const url = `redis://${host}:${port}`;

        const client = createClient({ url });
        client.on('error', (error) => {
          logger.error(`Redis error: ${String(error)}`);
        });

        logger.log(`🔄 Redis 연결 시도: ${url}`);
        await client.connect();
        logger.log(`✅ Redis 연결 성공: ${url}`);

        return client as AppRedisClient;
      },
    },
    {
      provide: IOREDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): AppIORedisClient => {
        const logger = new Logger(
          IOREDIS_CLIENT.description ?? 'IOREDIS_CLIENT'
        );

        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 6379);

        const client = new Redis({
          host,
          port,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        client.on('error', (error) => {
          logger.error(`Redis JSON Client error: ${String(error)}`);
        });

        client.on('connect', () => {
          logger.log(`✅ Redis JSON Client 연결 성공: ${host}:${port}`);
        });

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT, IOREDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisModule.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: AppRedisClient,
    @Inject(IOREDIS_CLIENT)
    private readonly ioredisClient: AppIORedisClient
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.redisClient?.isOpen) {
      try {
        await this.redisClient.quit();
      } catch (error) {
        this.logger.warn(
          `Redis quit 실패(signal=${signal ?? 'unknown'}): ${String(error)}`
        );
        this.redisClient.destroy();
      }
    }

    // JSON 클라이언트 종료
    if (this.ioredisClient?.status === 'ready') {
      try {
        await this.ioredisClient.quit();
      } catch (error) {
        this.logger.warn(
          `Redis IOClient quit 실패(signal=${signal ?? 'unknown'}): ${String(error)}`
        );
        this.ioredisClient.disconnect();
      }
    }
  }
}
