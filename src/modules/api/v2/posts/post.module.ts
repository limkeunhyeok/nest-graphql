import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { CommentModule } from '../comments/comment.module';
import { UserModule } from '../users/user.module';
import { PostResolver } from './adapters/graphql/post.resolver';
import { PostRepository } from './adapters/repositories/post.repository';
import { PostLoader } from './domain/loaders/post.loader';
import { Post, PostSchema } from './domain/models/post.entity';
import { PostService } from './domain/services/post.service';

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
  exports: [PostService],
  providers: [
    PostResolver,
    PostService,
    PostRepository,
    PostLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class PostModule {}
