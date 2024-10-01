import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CommentLoader } from '../comments/comment.loader';
import { Comment } from '../comments/entities/comment.entity';
import { Role, User } from '../users/entities/user.entity';
import { UserLoader } from '../users/user.loader';
import { CreatePostInput } from './dtos/create.input';
import { ReadPostInput } from './dtos/read.input';
import { UpdatePostInput } from './dtos/update.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.create(user.userId, createPostInput);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @Context() context,
  ) {
    const user = context.req['user'];

    return await this.postService.updateById(
      user.userId,
      updatePostInput.postId,
      updatePostInput,
    );
  }

  @Mutation(() => Post)
  async deletePost(
    @Args('id', { type: () => String }) id: MongoId,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.deleteById(user.userId, id);
  }

  @Query(() => [Post])
  async getPostsByQuery(@Args('readPostInput') readPostInput: ReadPostInput) {
    return await this.postService.findByQuery({
      ...readPostInput,
    });
  }

  @ResolveField(() => [Comment])
  async comments(
    @Parent() post: Post,
    @Loader(CommentLoader) commentLoader: Loader<string, Comment[]>,
  ) {
    return commentLoader.load(post._id.toString());
  }

  @ResolveField(() => User)
  async author(
    @Parent() post: Post,
    @Loader(UserLoader) userLoader: Loader<string, User>,
  ): Promise<User> {
    return userLoader.load(post.authorId.toString());
  }
}
