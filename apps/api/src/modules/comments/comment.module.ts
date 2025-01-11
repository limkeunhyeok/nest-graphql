import { NestLoaderInterceptor } from '@common/core/interceptors/loader.interceptor';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentResolver } from './adapters/graphql/resolver/comment.resolver';
import {
  Comment,
  CommentSchema,
} from './adapters/persistence/entities/comment.entity';
import { CommentRepository } from './adapters/persistence/repositories/comment.repository';
import { CommentLoader } from './applications/loaders/comment.loader';
import { CommentService } from './applications/services/comment.service';
import { COMMENT_REPOSITORY, COMMENT_SERVICE } from './comment.const';

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
  exports: [
    {
      provide: COMMENT_SERVICE,
      useClass: CommentService,
    },
  ],
  providers: [
    CommentResolver,
    CommentLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: NestLoaderInterceptor,
    },
    {
      provide: COMMENT_SERVICE,
      useClass: CommentService,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },
  ],
})
export class CommentModule {}
