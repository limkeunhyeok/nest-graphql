import {
  BadRequestException,
  ForbiddenException,
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
import { sanitizeQuery } from 'src/libs/utils';
import { CommentRepository } from '../../adapters/repositories/comment.repository';
import { CommentServicePort } from '../../ports/in/comment.service.port';
import {
  CommentDomain,
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../models/comment.domain';

@Injectable()
export class CommentService implements CommentServicePort {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(commentInfo: CommentInfo): Promise<CommentJson> {
    const createdComment = await this.commentRepository.create({
      ...commentInfo,
    });

    return CommentDomain.fromJson(createdComment).toJson();
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
    return CommentDomain.fromJson(updatedComment).toJson();
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

    return CommentDomain.fromJson(deletedComment).toJson();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<CommentJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<CommentJson>> {
    const sanitizedFilterQuery = sanitizeQuery(filterQuery);

    const docsPromise = this.commentRepository.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise =
      this.commentRepository.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    const comments = docs.map((doc) => CommentDomain.fromJson(doc).toJson());
    return paginateResponse({ total, limit, offset, docs: comments });
  }

  async findByQuery(filterQuery: FilterQuery<CommentJson>) {
    return await this.commentRepository.find(filterQuery);
  }
}
