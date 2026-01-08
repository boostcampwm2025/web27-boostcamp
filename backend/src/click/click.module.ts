import { Module } from '@nestjs/common';
import { ClickController } from './click.controller';
import { ClickService } from './click.service';
import { ClickLogRepository } from './click-log.repository';

@Module({
  controllers: [ClickController],
  providers: [ClickService, ClickLogRepository],
  exports: [ClickService],
})
export class ClickModule {}
