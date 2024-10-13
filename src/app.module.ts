import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as depthLimit from 'graphql-depth-limit';
import { Connection } from 'mongoose';
import * as path from 'path';
import { AuthGuard } from './common/guards/auth.guard';
import { HealthModule } from './common/health/health.module';
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
import { Role } from './constants/role.const';
import { SECRET_KEY } from './constants/server.const';
import { ApiModule } from './modules/api/v2/api.module';
import { UserService } from './modules/api/v2/users/domain/services/user.service';

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
    }),
    ApiModule,
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
    HealthModule,
  ],
  providers: [Logger, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [Logger],
})
export class AppModule implements OnModuleInit {
  private logger: Logger;

  constructor(
    private readonly userService: UserService,
    @InjectConnection() private connection: Connection,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async onModuleInit() {
    const email = 'admin@example.com';
    const password = bcrypt.hashSync('password', 10);
    const name = 'admin';
    const role = Role.ADMIN;

    const hasAdmin = await this.userService.findOneByEmail(email);
    if (!hasAdmin) {
      await this.userService.create({ email, password, name, role });
    }

    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });

    this.connection.on('reconnected', () => {
      this.logger.log('MongoDB reconnected');
    });

    this.connection.on('error', (error) => {
      this.logger.error(`MongoDB connection error: ${error}`);
    });

    this.connection.on('close', () => {
      this.logger.log('MongoDB connection closed');
    });
  }
}

// 초기에 db 재연결 로직을 작성하면서
// Mongoose를 랩핑하는 dynamic module을 만들려고 했으나,
// configService 때문에 생기는 의존성 문제로 그냥 onModuleInit에 작성
// 아래는 dynamic 모듈을 만드는데 참고한 자료.
// 근데, @nestjs/mongoose git에 들어가서 보니, 적당히 머리굴리면 다시 만들 수 있을거 같긴함.
// https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370
// https://the-masked-developer.github.io/wiki/%5Bnestjs%5Ddynamic-module/
