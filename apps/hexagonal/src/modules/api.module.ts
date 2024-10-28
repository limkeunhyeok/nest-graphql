import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import { PostModule } from './posts/post.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [UserModule, PostModule, CommentModule, AuthModule],
  exports: [UserModule, PostModule, CommentModule, AuthModule],
})
export class ApiModule {}
