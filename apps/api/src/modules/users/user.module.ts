import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { PostModule } from '../posts/post.module';
import { UserResolver } from './adapters/graphql/resolver/user.resolver';
import { User, UserSchema } from './adapters/persistence/entities/user.entity';
import { UserRepository } from './adapters/persistence/repositories/user.repository';
import { UserLoader } from './applications/loaders/user.loader';
import { UserService } from './applications/services/user.service';
import { USER_REPOSITORY, USER_SERVICE } from './user.const';

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
  exports: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
  ],
  providers: [
    UserResolver,
    UserLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
