import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpMetricsInterceptor } from './http-metrics.interceptor';

@Module({
  controllers: [MetricsController],
  providers: [
    MetricsService,
    { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
