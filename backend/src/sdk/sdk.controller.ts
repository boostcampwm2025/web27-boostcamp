import { Controller, Post, Body } from '@nestjs/common';
import { SdkService } from './sdk.service';
import { CreateViewLogDto } from './dto/create-view-log.dto';
import { successResponse } from 'src/common/response/success-response';
import { CreateClickLogDto } from './dto/create-click-log.dto';

@Controller('sdk')
export class SdkController {
  constructor(private readonly sdkService: SdkService) {}

  @Post('campaign-view')
  async recordView(@Body() createViewLogDto: CreateViewLogDto) {
    const viewId = await this.sdkService.recordView(createViewLogDto);
    return successResponse(
      { viewId },
      '캠페인 노출 로그가 성공적으로 저장되었습니다.'
    );
  }

  @Post('campaign-click')
  async recordClick(@Body() createClickLogDto: CreateClickLogDto) {
    const clickId = await this.sdkService.recordClick(createClickLogDto);
    return successResponse(
      { clickId },
      '캠페인 클릭 로그가 성공적으로 저장되었습니다.'
    );
  }
}
