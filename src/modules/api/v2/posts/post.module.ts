import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { CommentModule } from '../comments/comment.module';
import { UserModule } from '../users/user.module';
import { PostResolver } from './adapters/graphql/resolver/post.resolver';
import { Post, PostSchema } from './adapters/persistence/entities/post.entity';
import { PostRepository } from './adapters/persistence/repositories/post.repository';
import { PostLoader } from './applications/loaders/post.loader';
import { PostService } from './applications/services/post.service';
import { POST_REPOSITORY, POST_SERVICE } from './post.const';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    ConfigModule,
    CommentModule,
    forwardRef(() => UserModule),
  ],
  exports: [
    {
      provide: POST_SERVICE,
      useClass: PostService,
    },
  ],
  providers: [
    PostResolver,
    PostLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    {
      provide: POST_SERVICE,
      useClass: PostService,
    },
    {
      provide: POST_REPOSITORY,
      useClass: PostRepository,
    },
  ],
})
export class PostModule {}
