import {
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { IOREDIS_CLIENT } from './redis.constant';
import type { AppIORedisClient } from './redis.type';

@Global()
@Module({
  providers: [
    {
      provide: IOREDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): AppIORedisClient => {
        const logger = new Logger(
          IOREDIS_CLIENT.description ?? 'IOREDIS_CLIENT'
        );

        const host = configService.get<string>('REDIS_HOST', 'localhost');
        const port = configService.get<number>('REDIS_PORT', 16379);

        const client = new Redis({
          host,
          port,
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });

        client.on('error', (error) => {
          logger.error(`IORedis Client error: ${String(error)}`);
        });

        client.on('ready', () => {
          logger.log(`✅ IORedis Client 연결 성공: ${host}:${port}`);
        });

        client.on('reconnecting', (delay: number) => {
          logger.warn(`🔄 IORedis Client 재연결 시도 중... (${delay}ms 후)`);
        });

        return client;
      },
    },
  ],
  exports: [IOREDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  private readonly logger = new Logger(RedisModule.name);

  constructor(
    @Inject(IOREDIS_CLIENT)
    private readonly ioredisClient: AppIORedisClient
  ) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.ioredisClient?.status === 'ready') {
      try {
        await this.ioredisClient.quit();
        this.logger.log('✅ IORedis Client 정상 종료');
      } catch (error) {
        this.logger.warn(
          `IORedis Client quit 실패(signal=${signal ?? 'unknown'}): ${String(error)}`
        );
        this.ioredisClient.disconnect();
      }
    }
  }
}
