import { forwardRef, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { CommentModule } from '../comments/comment.module';
import { UserModule } from '../users/user.module';
import { Post, PostSchema } from './entities/post.entity';
import { PostLoader } from './post.loader';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    CommentModule,
    forwardRef(() => UserModule),
  ],
  exports: [PostService],
  providers: [
    PostResolver,
    PostService,
    PostLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class PostModule {}
