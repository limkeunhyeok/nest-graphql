import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from '../comments/comment.module';
import { Post, PostSchema } from './entities/post.entity';
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
  ],
  exports: [PostService],
  providers: [PostResolver, PostService],
})
export class PostModule {}
