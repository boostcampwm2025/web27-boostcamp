import { Injectable } from '@nestjs/common';
import {
  Counter,
  Registry,
  Histogram,
  collectDefaultMetrics,
  Gauge,
} from 'prom-client';

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

  private readonly sseConnections = new Gauge<'endpoint'>({
    name: 'boostad_sse_connections',
    help: 'Current SSE connections',
    labelNames: ['endpoint'],
  });

  constructor() {
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'boostad_backend_',
      labels: { service: 'backend' },
    });
  }

  recordHttpRequest(
    method: string,
    route: string,
    status_code: number,
    durationMs: number
  ): void {
    const labels = { method, route, status_code };
    this.httpRequestsTotal.inc(labels);
    this.httpRequestDurationSeconds.observe(labels, durationMs / 1000);
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  async getMetrics(): Promise<string> {
    return await this.registry.metrics(); // 레지스트리에 등록된 모든 메트릭 텍스트로 직렬화해서 리턴
  }
}
