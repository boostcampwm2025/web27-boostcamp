import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(WorkerModule);
    app.enableShutdownHooks();
    console.log('Worker 부트스트랩 성공');
  } catch (error) {
    console.error('Worker 부트스트랩 실패:', error);
    process.exit(1);
  }
}

void bootstrap();
