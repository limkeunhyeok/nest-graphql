import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostResolver } from './adapters/graphql/post.resolver';
import { PostRepository } from './adapters/repositories/post.repository';
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
  ],
  exports: [PostService],
  providers: [PostResolver, PostService, PostRepository],
})
export class PostModule {}
