import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClickModule } from './click/click.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClickModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
