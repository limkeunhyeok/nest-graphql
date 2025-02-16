import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { Loader } from '@common/core/decorators/loader.decorator';
import { RoleGuard } from '@common/core/guards/role.guard';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { CommentOutput } from '../../../../comments/adapters/graphql/outputs/comment.output';
import { CommentLoader } from '../../../../comments/applications/loaders/comment.loader';
import { UserOutput } from '../../../../users/adapters/graphql/outputs/user.output';
import { UserLoader } from '../../../../users/applications/loaders/user.loader';
import { PostServicePort } from '../../../ports/in/post.service.port';
import { POST_SERVICE } from '../../../post.const';
import { CreatePostInput } from '../inputs/create.input';
import { ReadPostInput } from '../inputs/read.input';
import { UpdatePostInput } from '../inputs/update.input';
import { PaginatePostOutput } from '../outputs/paginate.output';
import { PostOutput } from '../outputs/post.output';

@Resolver(() => PostOutput)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class PostResolver {
  constructor(
    @Inject(POST_SERVICE) private readonly postService: PostServicePort,
  ) {}

  @Mutation(() => PostOutput)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.create({
      ...createPostInput,
      authorId: user.userId,
    });
  }

  @Mutation(() => PostOutput)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.updateById(
      updatePostInput.postId,
      user.userId,
      updatePostInput,
    );
  }

  @Mutation(() => PostOutput)
  async deletePost(
    @Args('postId', { type: () => String }) postId: MongoId,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.deleteById(postId, user.userId);
  }

  @Query(() => PaginatePostOutput)
  async paginatePosts(@Args('readPostInput') readPostInput: ReadPostInput) {
    const { _id, published, authorId, sortBy, sortOrder, limit, offset } =
      readPostInput;
    return await this.postService.paginateByQuery(
      {
        _id,
        published,
        authorId,
      },
      { sortBy, sortOrder },
      limit,
      offset,
    );
  }

  @ResolveField(() => [CommentOutput])
  async comments(
    @Parent() post: PostOutput,
    @Loader(CommentLoader) commentLoader: DataLoader<string, Comment[]>,
  ) {
    return commentLoader.load(post._id.toString());
  }

  @ResolveField(() => UserOutput)
  async author(
    @Parent() post: PostOutput,
    @Loader(UserLoader) userLoader: DataLoader<string, UserOutput>,
  ) {
    return userLoader.load(post.authorId.toString());
  }
}
