import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'src/constants/server.const';
import { UserModule } from '../users/user.module';
import { AuthResovler } from './adapters/graphql/auth.resolver';
import { AuthService } from './applications/services/auth.service';

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
  exports: [AuthService],
  providers: [AuthResovler, AuthService],
})
export class AuthModule {}
