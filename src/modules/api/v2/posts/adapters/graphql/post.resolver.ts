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
import { Role } from 'src/constants/role.const';
import { CommentOutput } from '../../../comments/adapters/dtos/comment.output';
import { CommentLoader } from '../../../comments/domain/loaders/comment.loader';
import { UserOutput } from '../../../users/adapters/dtos/user.output';
import { UserLoader } from '../../../users/applications/loaders/user.loader';
import { PostService } from '../../applications/services/post.service';
import { CreatePostInput } from '../dtos/create.input';
import { PaginatePostOutput } from '../dtos/paginate.output';
import { PostOutput } from '../dtos/post.output';
import { ReadPostInput } from '../dtos/read.input';
import { UpdatePostInput } from '../dtos/update.input';

@Resolver(() => PostOutput)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class PostResolver {
  constructor(private readonly postService: PostService) {}

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
    @Loader(CommentLoader) commentLoader: Loader<string, Comment[]>,
  ) {
    return commentLoader.load(post._id.toString());
  }

  @ResolveField(() => UserOutput)
  async author(
    @Parent() post: PostOutput,
    @Loader(UserLoader) userLoader: Loader<string, UserOutput>,
  ) {
    return userLoader.load(post.authorId.toString());
  }
}
