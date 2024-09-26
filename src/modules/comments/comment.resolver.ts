import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '../users/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dtos/create.input';
import { ReadCommentInput } from './dtos/read.input';
import { UpdateCommentInput } from './dtos/update.input';
import { Comment } from './entities/comment.entity';

@Resolver(() => Comment)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.commentService.create(user.userId, createCommentInput);
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Context() context,
  ) {
    const user = context.req['user'];

    return await this.commentService.updateById(
      user.userId,
      updateCommentInput.postId,
      updateCommentInput.commentId,
      updateCommentInput,
    );
  }

  @Mutation(() => Comment)
  async deleteComment(
    @Args('postId', { type: () => String }) postId: MongoId,
    @Args('commentId', { type: () => String }) commentId: MongoId,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.commentService.deleteById(user.userId, postId, commentId);
  }

  @Query(() => [Comment])
  async getCommentsByQuery(
    @Args('readCommentInput') readCommentInput: ReadCommentInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.commentService.findByQuery({
      authorId: user.userId,
      ...readCommentInput,
    });
  }

  @Query(() => Comment)
  async getCommentById(@Args('id', { type: () => String }) _id: MongoId) {
    return (await this.commentService.findByQuery({ _id }))[0];
  }
}
