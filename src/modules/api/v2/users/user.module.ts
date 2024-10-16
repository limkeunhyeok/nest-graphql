import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { PostModule } from '../posts/post.module';
import { UserResolver } from './adapters/graphql/user.resolver';
import { UserRepository } from './adapters/repositories/user.repository';
import { UserLoader } from './applications/loaders/user.loader';
import { UserService } from './applications/services/user.service';
import { User, UserSchema } from './domain/models/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ConfigModule,
    forwardRef(() => PostModule),
  ],
  exports: [UserService],
  providers: [
    UserResolver,
    UserService,
    UserRepository,
    UserLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class UserModule {}
