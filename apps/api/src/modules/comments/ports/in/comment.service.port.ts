import { MongoId } from '@common/core/@types/datatype';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { PaginateResponse } from '@common/utils/paginate';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  CommentDomain,
  CommentInfo,
  CommentJson,
  CommentRaw,
} from '../../domain/comment.domain';

export interface CommentServicePort {
  create(commentRaw: CommentInfo): Promise<CommentJson>;
  updateById(
    commentId: MongoId,
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<CommentRaw>,
  ): Promise<CommentJson>;
  deleteById(
    commentId: MongoId,
    postId: MongoId,
    authorId: MongoId,
  ): Promise<CommentJson>;
  paginateByQuery(
    filterQuery: FilterQuery<CommentRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<CommentJson>>;
  findByQuery(filterQuery: FilterQuery<CommentJson>): Promise<CommentDomain[]>;
}
