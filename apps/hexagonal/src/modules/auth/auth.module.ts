import { SECRET_KEY } from '@common/core/constants/server.const';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { AuthResovler } from './adapters/graphql/resolver/auth.resolver';
import { AuthService } from './applications/services/auth.service';
import { AUTH_SERVICE } from './auth.const';

@Module({
  imports: [
    UserModule,
    ConfigModule,
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
  exports: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  providers: [
    AuthResovler,
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
