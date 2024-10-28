import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { RoleGuard } from '@common/core/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dtos/create.input';
import { PaginateCommentOutput } from './dtos/paginate.output';
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
    return await this.commentService.create({
      ...createCommentInput,
      authorId: user.userId,
    });
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @Context() context,
  ) {
    const user = context.req['user'];

    return await this.commentService.updateById(
      updateCommentInput.commentId,
      updateCommentInput.postId,
      user.userId,
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
    return await this.commentService.deleteById(commentId, postId, user.userId);
  }

  @Query(() => PaginateCommentOutput)
  async paginateComments(
    @Args('readCommentInput') readCommentInput: ReadCommentInput,
  ) {
    const {
      _id,
      published,
      authorId,
      postId,
      sortBy,
      sortOrder,
      limit,
      offset,
    } = readCommentInput;
    return await this.commentService.paginateByQuery(
      {
        _id,
        published,
        authorId,
        postId,
      },
      { sortBy, sortOrder },
      limit,
      offset,
    );
  }
}
