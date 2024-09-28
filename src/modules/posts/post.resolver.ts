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
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CommentService } from '../comments/comment.service';
import { Comment } from '../comments/entities/comment.entity';
import { Role } from '../users/entities/user.entity';
import { CreatePostInput } from './dtos/create.input';
import { ReadPostInput } from './dtos/read.input';
import { UpdatePostInput } from './dtos/update.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

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
  async getPostsByQuery(
    @Args('readPostInput') readPostInput: ReadPostInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.findByQuery({
      authorId: user.userId,
      ...readPostInput,
    });
  }

  @Query(() => Post)
  async getPostById(@Args('id', { type: () => String }) _id: MongoId) {
    return (await this.postService.findByQuery({ _id }))[0];
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() post: Post): Promise<Comment[]> {
    const { _id } = post;
    return await this.commentService.findByQuery({ _id });
  }
}
