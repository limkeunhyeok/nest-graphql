import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { RoleGuard } from '@common/core/guards/role.guard';
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
import { CommentLoader } from '../comments/comment.loader';
import { CommentService } from '../comments/comment.service';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { UserLoader } from '../users/user.loader';
import { CreatePostInput } from './dtos/create.input';
import { PaginatePostOutput } from './dtos/paginate.output';
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
    return await this.postService.create({
      ...createPostInput,
      authorId: user.userId,
    });
  }

  @Mutation(() => Post)
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

  @Mutation(() => Post)
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

  @Query(() => [Post])
  async getPostsForLoaderTest(
    @Args('limit', { type: () => Number }) limit: number,
  ) {
    return await this.postService.getPostsForLoaderTest(limit);
  }

  @ResolveField(() => [Comment])
  async commentsWithLoader(
    @Parent() post: Post,
    @Loader(CommentLoader) commentLoader: Loader<string, Comment[]>,
  ) {
    return commentLoader.load(post._id.toString());
  }

  @ResolveField(() => [Comment])
  async commentsWithoutLoader(@Parent() post: Post): Promise<Comment[]> {
    const { _id } = post;
    const answer = await this.commentService.findByQuery({ postId: _id });
    return answer;
  }

  @ResolveField(() => User)
  async author(
    @Parent() post: Post,
    @Loader(UserLoader) userLoader: Loader<string, User>,
  ): Promise<User> {
    return userLoader.load(post.authorId.toString());
  }
}
