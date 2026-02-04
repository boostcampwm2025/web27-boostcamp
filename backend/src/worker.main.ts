import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
}

void bootstrap();
