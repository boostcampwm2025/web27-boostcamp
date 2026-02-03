import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { Observable } from 'rxjs';

type RouteLike = { path?: unknown };
@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const startedAt = process.hrtime.bigint();
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
