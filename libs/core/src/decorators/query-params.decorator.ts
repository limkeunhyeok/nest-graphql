import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// ResolveField에서 Query Params를 사용하기 위함
export const QueryParams = createParamDecorator(
  (data: unknown, context: ExecutionContext): any => {
    const ctx = GqlExecutionContext.create(context);

    const { req } = ctx.getContext();

    // Get the query args from the request object
    return req.args;
  },
);
