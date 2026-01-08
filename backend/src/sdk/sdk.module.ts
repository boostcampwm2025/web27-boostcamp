import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { LogModule } from 'src/log/log.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [LogModule, CacheModule],
  controllers: [SdkController],
  providers: [SdkService],
})
export class SdkModule {}
