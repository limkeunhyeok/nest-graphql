import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { CommentResolver } from './adapters/graphql/comment.resolver';
import { CommentRepository } from './adapters/repositories/comment.repository';
import { CommentLoader } from './domain/loaders/comment.loader';
import { Comment, CommentSchema } from './domain/models/comment.entity';
import { CommentService } from './domain/services/comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    ConfigModule,
  ],
  exports: [CommentService],
  providers: [
    CommentResolver,
    CommentService,
    CommentRepository,
    CommentLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class CommentModule {}
