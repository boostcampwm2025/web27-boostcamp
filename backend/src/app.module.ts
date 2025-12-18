import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RTBModule } from './rtb/rtb.module';
import { ClickModule } from './click/click.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClickModule, RTBModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
