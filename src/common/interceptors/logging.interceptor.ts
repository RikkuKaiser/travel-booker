import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const duration = Date.now() - start;

        // esto me sirve para saber que tipo de request fue y proveniente
        const log = {
          method,
          url: originalUrl,
          statusCode: res.statusCode,
          responseTimeMs: duration,
          userId: req.user?.userId ?? null,
          timestamp: new Date().toISOString(),
        };

        console.log(JSON.stringify(log, null, 2));
      }),
    );
  }
}
