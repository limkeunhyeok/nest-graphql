import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { LogLevel } from 'src/libs/logger';
import { isEmptyObject } from 'src/libs/utils';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);

    const convertedException = this.convert(exception);

    const info = gqlHost.getInfo();

    const operationType = info.parentType.name;
    const operationName = info.fieldName;
    const variableValues = isEmptyObject(gqlHost.getArgs())
      ? null
      : gqlHost.getArgs();
    const selectionSets = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );

    const error = {
      exceptionCode: convertedException.name,
      statusCode: convertedException.getStatus(),
      message: convertedException.message,
      stack: convertedException.stack,
    };

    this.logger.log({
      level: LogLevel.ERROR,
      operationType,
      operationName,
      variableValues,
      selectionSets,
      message: 'An error occurred.',
      error,
    });

    return convertedException;
  }

  private convert(exception) {
    if (exception instanceof HttpException) {
      return exception;
    }
    return new InternalServerErrorException(exception.message);
  }
}
