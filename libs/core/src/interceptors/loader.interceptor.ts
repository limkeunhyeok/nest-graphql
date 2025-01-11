import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Observable } from 'rxjs';

export interface NestLoader<Key, Value> {
  generateLoader(
    params?: Record<string, any>,
  ): DataLoader<Key, Value | Value[]>;
}

export const NEST_LOADER_CONTEXT_KEY = 'NEST_LOADER_CONTEXT_KEY';

@Injectable()
export class NestLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();

    const params: Record<string, any> = Object.values(gqlContext.getArgs())[0];

    if (ctx[NEST_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_LOADER_CONTEXT_KEY] = {
        contextId: ContextIdFactory.create(),
        getLoader: (type: string): Promise<NestLoader<any, any>> => {
          if (ctx[type] === undefined) {
            try {
              ctx[type] = (async () => {
                return (
                  await this.moduleRef.resolve<NestLoader<any, any>>(
                    type,
                    ctx[NEST_LOADER_CONTEXT_KEY].contextId,
                    { strict: false },
                  )
                ).generateLoader(params);
              })();
            } catch (e) {
              throw new InternalServerErrorException(
                `The loader ${type} is not provided` + e,
              );
            }
          }
          return ctx[type];
        },
      };
    }
    return next.handle();
  }
}
