import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import { PostModule } from './posts/post.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [AuthModule, UserModule, PostModule, CommentModule],
  exports: [AuthModule, UserModule, PostModule, CommentModule],
})
export class ApiModule {}
