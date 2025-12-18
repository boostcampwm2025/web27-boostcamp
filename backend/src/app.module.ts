import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickModule } from './click/click.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // SDK 정적 파일 서빙 (개발 환경용)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ClickModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
