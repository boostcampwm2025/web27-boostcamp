import { Controller, Post, Body } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { successResponse } from 'src/common/response/success-response';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkservice: SdkService) {}

  @Post('campaign-view')
  recordView(@Body() createViewLogDto: CreateViewLogDto) {
    const viewId = this.sdkservice.recordView(createViewLogDto);
    return successResponse(
      { viewId },
      '캠페인 노출 로그가 성공적으로 저장되었습니다.'
    );
  }
}
