import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { type Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
@Public()
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Content-Type', this.metricsService.getContentType());
    return await this.metricsService.getMetrics();
  }
}
