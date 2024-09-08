import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthGuard } from './common/guards/auth.guard';
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
import { SECRET_KEY } from './constants/server.const';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/posts/post.module';
import { Role } from './modules/users/entities/user.entity';
import { UserModule } from './modules/users/user.module';
import { UserService } from './modules/users/user.service';

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
      formatError: (error) => {
        const { message, path, extensions } = error;

        // 일단, 아폴로 자체 에러는 400으로 처리
        const statusCode = extensions.originalError
          ? (extensions.originalError as any).statusCode
          : 400;
        const exceptionCode = extensions.code;
        const stack = extensions.stacktrace;

        return {
          message: 'An error occurred.',
          path,
          extensions: {
            exceptionCode,
            statusCode,
            message,
            stack,
          },
        };
      },
    }),
    UserModule,
    AuthModule,
    PostModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get(SECRET_KEY),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  providers: [
    AppService,
    AppResolver,
    Logger,
    // { provide: APP_INTERCEPTOR, useClass: AuthInterceptor },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [Logger],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    const email = 'admin@example.com';
    const password = 'password';
    const name = 'admin';
    const role = Role.ADMIN;

    const hasAdmin = await this.userService.findOneByEmail(email);
    if (!hasAdmin) {
      await this.userService.create({ email, password, name, role });
    }
  }
}
