import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

export class PaginateParamsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Write every query args to the request object
    req.args = ctx.getArgs();

    return next.handle();
  }
}
