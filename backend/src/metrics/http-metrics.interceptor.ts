import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { Observable, tap } from 'rxjs';
import { MetricsService } from './metrics.service';

type RouteLike = { path?: unknown };
@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const startedAt = process.hrtime.bigint();

    const path = this.getRoutePath(req);

    if (path === '/api/metrics' || path === '/healthz') return next.handle();

    return next.handle().pipe(
      tap({
        next: () => this.record(req.method, path, res.statusCode, startedAt),
        error: (error) => {
          const statusCode =
            error instanceof HttpException ? error.getStatus() : 500;
          this.record(req.method, path, statusCode, startedAt);
        },
      })
    );
  }

  private record(
    method: string,
    route: string,
    statusCode: number,
    startedAt: bigint
  ) {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    this.metricsService.recordHttpRequest(
      method,
      route,
      statusCode,
      durationMs
    );
  }
  private getRoutePath(req: Request): string {
    const route = req.route as RouteLike | undefined;
    const routePath = route?.path;

    if (typeof routePath === 'string') {
      return `${req.baseUrl ?? ''}${routePath}`;
    }

    return req.path ?? 'unknown';
  }
}
