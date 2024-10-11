import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentResolver } from './adapters/graphql/comment.resolver';
import { CommentRepository } from './adapters/repositories/comment.repository';
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
  providers: [CommentResolver, CommentService, CommentRepository],
})
export class CommentModule {}
