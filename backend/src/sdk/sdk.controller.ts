import { Controller, Post, Body } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateViewLogDto } from './dto/create-view-log.dto';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkservice: SdkService) {}

  @Post('campaign-view')
  recordView(@Body() createViewLogDto: CreateViewLogDto) {
    this.sdkservice.recordView(createViewLogDto);
  }
}
