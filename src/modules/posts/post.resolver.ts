import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '../users/entities/user.entity';
import { CreatePostInput } from './dtos/create.input';
import { ReadPostInput } from './dtos/read.input';
import { UpdatePostInput } from './dtos/update.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
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
      updatePostInput._id,
      updatePostInput,
    );
  }

  @Mutation(() => Post)
  async deleteById(
    @Args('id', { type: () => String }) id: MongoId,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.postService.deleteById(user.userId, id);
  }

  @Query(() => [Post])
  @UseGuards(RoleGuard([Role.ADMIN]))
  async findByQuery(
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
  async getPostById(@Args('id', { type: () => String }) id: MongoId) {
    return await this.postService.findByQuery({ _id: id });
  }
}
