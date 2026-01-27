import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());
  // Static 파일 서빙 (SDK)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // API Global Prefix 설정
  app.setGlobalPrefix('api');

  // Validation 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS 설정
  const corsOrigin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin:
      !corsOrigin || corsOrigin === '*'
        ? true
        : corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  if (process.env.NODE_ENV === 'development') {
    await app.listen(port, '0.0.0.0');
    console.log('development mode');
  } else {
    await app.listen(port);
    console.log('production mode');
  }

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

void bootstrap();
