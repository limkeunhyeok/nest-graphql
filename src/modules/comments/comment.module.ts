import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { CommentLoader } from './comment.loader';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  exports: [CommentService],
  providers: [
    CommentResolver,
    CommentService,
    CommentLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class CommentModule {}
