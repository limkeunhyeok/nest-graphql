import { Role } from '@common/core/constants/role.const';
import { AuthGuard } from '@common/core/guards/auth.guard';
import { HealthModule } from '@common/modules/health/health.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { GraphqlConfigService } from './configs/graphql.config.service';
import { JwtConfigService } from './configs/jwt.config.service';
import { MongodbConfigService } from './configs/mongo.config.service';
import serverConfig from './configs/server.config';
import { ApiModule } from './modules/api.module';
import { UserService } from './modules/users/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [serverConfig] }),
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
  ],
  providers: [Logger, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [Logger],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    const email = 'admin@example.com';
    const password = bcrypt.hashSync('password', 10);
    const name = 'admin';
    const role = Role.ADMIN;

    const hasAdmin = await this.userService.findOneByEmail(email);
    if (!hasAdmin) {
      await this.userService.create({ email, password, name, role });
    }
  }
}
