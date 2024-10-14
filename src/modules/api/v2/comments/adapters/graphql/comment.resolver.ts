import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/constants/role.const';
import { CommentService } from '../../domain/services/comment.service';
import { CommentOutput } from '../dtos/comment.output';
import { CreateCommentInput } from '../dtos/create.input';
import { PaginateCommentOutput } from '../dtos/paginate.output';
import { ReadCommentInput } from '../dtos/read.input';
import { UpdateCommentInput } from '../dtos/update.input';

@Resolver(() => CommentOutput)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

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
