import { Role } from '@common/core/constants/role.const';
import { AuthGuard } from '@common/core/guards/auth.guard';
import { HealthModule } from '@common/modules/health/health.module';
import { PubSubModule } from '@common/modules/pubsub/pubsub.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphqlConfigService } from './configs/graphql.config.service';
import { JwtConfigService } from './configs/jwt.config.service';
import { MongodbConfigService } from './configs/mongo.config.service';
import serverConfig from './configs/server.config';
import { ApiModule } from './modules/api.module';
import { UserServicePort } from './modules/users/ports/in/user.service.port';
import { USER_SERVICE } from './modules/users/user.const';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useClass: MongodbConfigService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlConfigService,
    }),
    ApiModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    HealthModule,
    PubSubModule,
  ],
  providers: [Logger, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [Logger],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserServicePort,
  ) {}

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

// 초기에 db 재연결 로직을 작성하면서
// Mongoose를 랩핑하는 dynamic module을 만들려고 했으나,
// configService 때문에 생기는 의존성 문제로 그냥 MongodbConfigService 작성
// 아래는 dynamic 모듈을 만드는데 참고한 자료.
// 근데, @nestjs/mongoose git에 들어가서 보니, 적당히 머리굴리면 다시 만들 수 있을거 같긴함.
// https://dev.to/nestjs/advanced-nestjs-how-to-build-completely-dynamic-nestjs-modules-1370
// https://the-masked-developer.github.io/wiki/%5Bnestjs%5Ddynamic-module/
