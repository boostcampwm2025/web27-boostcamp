import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@keyv/redis';
import { REDIS_CLIENT } from './redis.constant';
import type { AppRedisClient } from './redis.type';

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
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisModule.name);

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: AppRedisClient
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (!this.redisClient) return;
    if (!this.redisClient.isOpen) return;

    try {
      await this.redisClient.quit();
    } catch (error) {
      this.logger.warn(
        `Redis quit 실패(signal=${signal ?? 'unknown'}): ${String(error)}`
      );
      this.redisClient.destroy();
    }
  }
}
