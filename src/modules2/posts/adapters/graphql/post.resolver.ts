import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '../../../../constants/role.const';
import { CreatePostInput } from '../../domain/dtos/create.input';
import { PaginatePostOutput } from '../../domain/dtos/paginate.output';
import { PostOutput } from '../../domain/dtos/post.output';
import { ReadPostInput } from '../../domain/dtos/read.input';
import { UpdatePostInput } from '../../domain/dtos/update.input';
import { PostService } from '../../domain/services/post.service';

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
}
