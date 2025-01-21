import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import * as depthLimit from 'graphql-depth-limit';
import * as path from 'path';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): Promise<ApolloDriverConfig> | ApolloDriverConfig {
    return {
      playground: false,
      installSubscriptionHandlers: true,
      debug: true,
      autoSchemaFile: path.join(process.cwd(), 'apps/api/src', 'schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      validationRules: [depthLimit(3)], // Paginate의 경우가 있어 3으로 제한
      formatError: (error) => {
        const { message, path, extensions } = error;
        // 일단, 아폴로 자체 에러는 400으로 처리
        const statusCode = extensions.originalError
          ? (extensions.originalError as any).statusCode
          : 400;
        const exceptionCode = extensions.code;
        const stack = extensions.stacktrace;
        const timestamp = new Date();

        return {
          message: 'An error occurred.',
          path,
          extensions: {
            exceptionCode,
            statusCode,
            message,
            stack,
            timestamp,
          },
        };
      },
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (headersRaw: Record<string, unknown>) => {
            const headers = Object.keys(headersRaw).reduce((dest, key) => {
              dest[key.toLowerCase()] = headersRaw[key];
              console.log(dest);
              return dest;
            }, {});
            return {
              req: {
                headers: headers,
              },
            };
          },
        },
      },
    };
  }
}
