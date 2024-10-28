import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { RoleGuard } from '@common/core/guards/role.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { COMMENT_SERVICE } from '../../../comment.const';
import { CommentServicePort } from '../../../ports/in/comment.service.port';
import { CreateCommentInput } from '../inputs/create.input';
import { ReadCommentInput } from '../inputs/read.input';
import { UpdateCommentInput } from '../inputs/update.input';
import { CommentOutput } from '../outputs/comment.output';
import { PaginateCommentOutput } from '../outputs/paginate.output';

@Resolver(() => CommentOutput)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class CommentResolver {
  constructor(
    @Inject(COMMENT_SERVICE)
    private readonly commentService: CommentServicePort,
  ) {}

  @Mutation(() => CommentOutput)
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

  @Mutation(() => CommentOutput)
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

  @Mutation(() => CommentOutput)
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
      postId,
      authorId,
      sortBy,
      sortOrder,
      limit,
      offset,
    } = readCommentInput;
    return await this.commentService.paginateByQuery(
      {
        _id,
        published,
        postId,
        authorId,
      },
      { sortBy, sortOrder },
      limit,
      offset,
    );
  }
}
