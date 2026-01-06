import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';

@Module({
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
