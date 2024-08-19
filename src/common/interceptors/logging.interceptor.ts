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
import { isEmptyObject } from 'src/libs/utils';

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
    if (context.getType<GqlContextType>() === 'graphql') {
      this.writeLog(context, 'A request has arrived.', LogLevel.INFO);

      return next.handle().pipe(
        tap({
          next: (val: unknown): void => {
            this.writeLog(context, 'Send a response.', LogLevel.INFO);
          },
        }),
      );
    }
    return next.handle();
  }

  private writeLog(
    context: ExecutionContext,
    message: string,
    logLevel: LogLevel,
  ) {
    const gqlContext = GqlExecutionContext.create(context);

    const info = gqlContext.getInfo();

    const operationType = info.parentType.name;
    const operationName = info.fieldName;
    const variableValues = isEmptyObject(gqlContext.getArgs())
      ? null
      : gqlContext.getArgs();
    const selectionSets = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );

    this.logger.log({
      level: logLevel,
      operationType,
      operationName,
      variableValues,
      selectionSets,
      message,
    });
  }
}
