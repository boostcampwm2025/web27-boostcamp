import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RTBModule } from './rtb/rtb.module';

@Module({
  imports: [RTBModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
