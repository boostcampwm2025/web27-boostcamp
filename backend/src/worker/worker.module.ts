import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { QueueModule } from 'src/queue/queue.module';
import { EmbeddingWorker } from 'src/queue/workers/embedding.worker';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    RedisModule,
    QueueModule,
  ],
  providers: [EmbeddingWorker],
})
export class WorkerModule {}
