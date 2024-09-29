import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from '../comments/comment.module';
import { UserModule } from '../users/user.module';
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
    forwardRef(() => UserModule),
  ],
  exports: [PostService],
  providers: [PostResolver, PostService],
})
export class PostModule {}
