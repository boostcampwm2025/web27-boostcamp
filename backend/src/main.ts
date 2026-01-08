import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API Global Prefix 설정 (예: http://localhost:3000/api/...)
  app.setGlobalPrefix('api');

  // CORS 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS_ORIGIN이 '*'면 모든 origin 허용, 미설정이면 모두 허용, 그 외에는 지정된 origin만
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin:
      !corsOrigin || corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}

void bootstrap();
