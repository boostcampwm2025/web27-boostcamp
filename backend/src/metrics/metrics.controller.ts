import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { type Response } from 'express';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res({ passthrough: true }) res: Response) {
    return await this.metricsService.getMetrics();
  }
}
