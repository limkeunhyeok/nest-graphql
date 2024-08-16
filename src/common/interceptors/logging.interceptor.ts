import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Graphql
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const parentType = info.parentType.name;
      const fieldName = info.fieldName;
      const body = info.fieldNodes[0]?.loc?.source?.body;
      const message = `GraphQL - ${parentType} - ${fieldName}`;

      // // Add request ID,so it can be tracked with response
      // const requestId = uuidv4();
      // // Put to header, so can attach it to response as well
      // res.set('requestId', requestId);

      const trace = {
        userId: 'good',
        body,
      };

      // console.log('INFO!!!!!!!', JSON.stringify(info));
      // console.log(
      //   'INFO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      // );

      // console.log(`requestId: AAAAAAA`, {
      //   context: message,
      //   trace,
      // });

      return next.handle().pipe(
        tap({
          next: (val: unknown): void => {
            this.logNext(val, context);
          },
          error: (val: unknown): void => {
            this.errorNext(val, context);
          },
        }),
      );
    }
    return next.handle();
  }

  /**
   * Method to log response message
   */
  private logNext(body: unknown, context: ExecutionContext): void {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const parentType = info.parentType.name;
      const fieldName = info.fieldName;
      const res: Response = gqlContext.getContext().res;
      const message = `GraphQL - ${parentType} - ${fieldName}`;

      // Remove secure fields from request body and headers
      // const secureBody = secureReqBody(body);

      // const requestId = res.getHeader('requestId');

      // Log trace message
      const trace = {
        body: { good: 'body' },
      };
      // console.log(
      //   '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
      // );
      // console.log(body);
      // console.log(
      //   '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',
      // );
      this.logger.log({
        level: 'info',
        message,
      });
    }
  }

  private errorNext(body, context: ExecutionContext): void {
    if (context.getType<GqlContextType>() === 'graphql') {
      this.logger.log({
        level: 'error',
        message: 'error!',
      });
    }
  }
}
