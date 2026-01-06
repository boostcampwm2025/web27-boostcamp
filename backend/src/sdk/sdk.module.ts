import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [LogModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
