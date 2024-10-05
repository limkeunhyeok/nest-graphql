import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlContextType } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { COMMON_MESSAGE } from 'src/constants/exception-message.const';
import { LogLevel } from 'src/libs/logger';
import { isEmptyObject } from 'src/libs/utils';

// Graphql 및 Http 필터 처리
// TODO: 추후 Error와 Exception의 차이를 명확하게 정의하고 이름 수정
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const convertedException = this.convert(exception);
    const customException = this.getCustomException(convertedException);

    if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);

      const info = gqlHost.getInfo();

      const operationType = info?.parentType?.name;
      const operationName = info?.fieldName;
      const variableValues =
        gqlHost.getType<GqlContextType>() === 'graphql' &&
        !isEmptyObject(gqlHost.getArgs())
          ? gqlHost.getArgs()
          : null;
      const selectionSets = info?.fieldNodes[0]?.selectionSet?.selections?.map(
        (item) => item.name.value,
      );

      this.logger.log({
        level: LogLevel.ERROR,
        operationType,
        operationName,
        variableValues,
        selectionSets,
        message: COMMON_MESSAGE,
        error: customException,
      });

      return convertedException;
    }
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestQuery = request.query;
    const requestBody = request.body;

    const path = request.url;

    this.logger.log({
      level: LogLevel.ERROR,
      requestQuery,
      requestBody,
      message: COMMON_MESSAGE,
      error: customException,
    });

    const exceptionResponse = this.getExceptionResponse(customException, path);
    return response.status(customException.statusCode).json(exceptionResponse);
  }

  private convert(exception: unknown) {
    if (exception instanceof HttpException) {
      return exception;
    }

    const message =
      typeof exception === 'object' && 'message' in exception
        ? (exception as Error).message
        : 'Unhandled error occurred.';

    return new InternalServerErrorException(message);
  }

  private getCustomException(exception: HttpException): CustomExceptionFormat {
    return {
      exceptionCode: exception.name,
      statusCode: exception.getStatus(),
      message: exception.message,
      stack: exception.stack,
    };
  }

  // graphql과 동일 포맷
  private getExceptionResponse(error: CustomExceptionFormat, path: string) {
    return {
      errors: [
        {
          message: COMMON_MESSAGE,
          path: [path],
          extensions: {
            ...error,
            timestamp: new Date(),
          },
        },
      ],
      data: null,
    };
  }
}

export interface CustomExceptionFormat {
  exceptionCode: string;
  statusCode: number;
  message: string;
  stack: string;
  timestamp?: Date;
}
