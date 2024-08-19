import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';
import { LogLevel } from 'src/libs/logger';

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
      this.writeLog(context, false, 'A request has arrived.', LogLevel.INFO);

      return next.handle().pipe(
        tap({
          next: (val: unknown): void => {
            this.writeLog(
              context,
              false,
              'Send a response.',
              LogLevel.INFO,
              val,
            );
          },
          error: (val: unknown): void => {
            this.writeLog(
              context,
              true,
              'An error occurred.',
              LogLevel.ERROR,
              val,
            );
          },
        }),
      );
    }
    return next.handle();
  }

  private writeLog(
    context: ExecutionContext,
    isError: boolean,
    message: string,
    logLevel: LogLevel,
    body?: any,
  ) {
    const gqlContext = GqlExecutionContext.create(context);

    const info = gqlContext.getInfo();

    const operationType = info.parentType.name;
    const operationName = info.fieldName;
    const variableValues = info.variableValues[operationName]
      ? info.variableValues[operationName]
      : null;
    const selectionSets = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );

    const error = isError
      ? {
          exceptionCode: body.name,
          statusCode: body.status,
          message: body.message,
          stack: body.stack,
        }
      : null;

    this.logger.log({
      level: logLevel,
      operationType,
      operationName,
      variableValues,
      selectionSets,
      message,
      error,
    });
  }
}
