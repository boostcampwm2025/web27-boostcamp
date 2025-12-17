import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 (SDK가 외부 블로그에서 호출되므로 모든 도메인 허용)
  app.enableCors({
    origin: '*',
    credentials: false,
  });

  // Validation Pipe 추가
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📦 SDK available at http://localhost:${port}/sdk.js`);
}

void bootstrap();
