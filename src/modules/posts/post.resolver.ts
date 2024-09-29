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
import { Role, User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { CreatePostInput } from './dtos/create.input';
import { ReadPostInput } from './dtos/read.input';
import { UpdatePostInput } from './dtos/update.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

// create -> Post >> comment
// read -> Post[] >> paiging & comment, id로 조회해도 그냥 페이징하자 귀찬
// update -> Post >> comment
// delete -> Post >> comment

@Resolver(() => Post)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
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
  async getPostsByQuery(@Args('readPostInput') readPostInput: ReadPostInput) {
    return await this.postService.findByQuery({
      ...readPostInput,
    });
  }

  @ResolveField(() => [Comment])
  async comments(@Parent() post: Post): Promise<Comment[]> {
    const { _id } = post;
    const answer = await this.commentService.findByQuery({ postId: _id });
    return answer;
  }

  @ResolveField(() => User)
  async author(@Parent() post: Post): Promise<User> {
    const { authorId } = post;
    return await this.userService.findOneById(authorId);
  }
}
