import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './adapters/graphql/user.resolver';
import { UserRepository } from './adapters/repositories/user.repository';
import { User, UserSchema } from './domain/models/user.entity';
import { UserService } from './domain/services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
  ],
  exports: [UserService],
  providers: [UserResolver, UserService, UserRepository],
})
export class UserModule {}
