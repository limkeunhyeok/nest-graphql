import { LogLevel, isEmptyObject } from '@common/utils';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
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
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      const info = gqlContext.getInfo();

      const operationType = info.parentType.name;
      const operationName = info.fieldName;
      const variableValues = isEmptyObject(gqlContext.getArgs())
        ? null
        : gqlContext.getArgs();

      const selectionSets = info.fieldNodes[0]?.selectionSet?.selections?.map(
        (item) => item.name.value,
      );

      this.logger.log({
        level: LogLevel.INFO,
        operationType,
        operationName,
        variableValues,
        selectionSets,
        message: 'A graphQL request has arrived.',
      });

      return next.handle().pipe(
        tap({
          next: (_: unknown): void => {
            this.logger.log({
              level: LogLevel.INFO,
              operationType,
              operationName,
              variableValues,
              selectionSets,
              message: 'Send a graphQL response.',
            });
          },
        }),
      );
    }

    const req = context.switchToHttp().getRequest<Request>();
    const { path, method, ip, query, body } = req;

    this.logger.log({
      level: LogLevel.INFO,
      path,
      method,
      ip,
      requestBody: body,
      requestQuery: query,
      message: 'A request has arrived.',
    });
    return next.handle().pipe(
      tap({
        next: (_: unknown): void => {
          this.logger.log({
            level: LogLevel.INFO,
            path,
            method,
            ip,
            requestBody: body,
            requestQuery: query,
            message: 'Send a response.',
          });
        },
      }),
    );
  }
}
