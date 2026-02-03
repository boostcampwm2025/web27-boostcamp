import { Injectable } from '@nestjs/common';
import { Counter, Registry, Histogram } from 'prom-client';

type HttpLabel = 'method' | 'route' | 'status_code';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  private readonly httpRequestsTotal = new Counter<HttpLabel>({
    name: 'boostad_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [this.registry],
  });

  private readonly httpRequestDurationSeconds = new Histogram<HttpLabel>({
    name: 'boostad_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [this.registry],
  });
}
