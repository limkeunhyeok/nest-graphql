import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
  RELATION_ID_MISMATCH,
} from 'src/constants/exception-message.const';
import { paginateResponse, PaginateResponse } from 'src/libs/paginate';
import { COMMENT_REPOSITORY } from '../../comment.const';
import {
  CommentDomain,
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';
import { CommentServicePort } from '../../ports/in/comment.service.port';
import { CommentRepositoryPort } from '../../ports/out/comment.repository.port';

@Injectable()
export class CommentService implements CommentServicePort {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
  ) {}

  async create(commentInfo: CommentInfo): Promise<CommentJson> {
    const createdComment = await this.commentRepository.create({
      ...commentInfo,
    });

    return createdComment.toJson();
  }

  async updateById(
    commentId: MongoId,
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<CommentRaw>,
  ): Promise<CommentJson> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const updatedComment = await this.commentRepository.updateById(
      commentId,
      updateQuery,
    );
    return updatedComment.toJson();
  }

  async deleteById(
    commentId: MongoId,
    postId: MongoId,
    authorId: MongoId,
  ): Promise<CommentJson> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (comment.postId !== postId) {
      throw new BadRequestException(RELATION_ID_MISMATCH);
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const deletedComment = await this.commentRepository.deleteById(commentId);

    return deletedComment.toJson();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<CommentRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<CommentJson>> {
    const { total, docs } = await this.commentRepository.getTotalAndDocs(
      filterQuery,
      sortQuery,
      limit,
      offset,
    );
    return paginateResponse({ total, limit, offset, docs });
  }

  async findByQuery(
    filterQuery: FilterQuery<CommentJson>,
  ): Promise<CommentDomain[]> {
    const comments = await this.commentRepository.find(filterQuery);
    return comments;
  }
}
