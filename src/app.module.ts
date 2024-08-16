import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import config from './config';
import {
  AUTH_SOURCE,
  MONGO_DB,
  MONGO_HOST,
  MONGO_NAME,
  MONGO_PASS,
  MONGO_PORT,
  MONGO_USER,
} from './constants/database.const';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `${MONGO_DB}://${configService.get(
          MONGO_HOST,
        )}:${configService.get(MONGO_PORT)}/${configService.get(MONGO_NAME)}`,
        authSource: AUTH_SOURCE,
        user: configService.get(MONGO_USER),
        pass: configService.get(MONGO_PASS),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      debug: true,
      autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
    }),
    UserModule,
  ],
  providers: [AppService, AppResolver, Logger],
  exports: [Logger],
})
export class AppModule {}
