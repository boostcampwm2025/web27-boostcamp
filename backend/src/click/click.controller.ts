import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ClickService } from './click.service';
import { TrackClickDto, TrackClickResponseDto } from '../types/dto/track-click.dto';
import { ClickLog } from '../types/click-log';

@Controller('click')
export class ClickController {
  constructor(private readonly clickService: ClickService) { }

  @Post('track')
  trackClick(@Body(ValidationPipe) dto: TrackClickDto): TrackClickResponseDto {
    return this.clickService.trackClick(dto);
  }

  @Get('logs')
  getRecentLogs(@Query('limit') limit?: string): ClickLog[] {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.clickService.getRecentLogs(parsedLimit);
  }
}
