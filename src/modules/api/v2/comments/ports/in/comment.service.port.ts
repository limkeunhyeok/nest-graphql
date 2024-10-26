import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PaginateResponse } from 'src/libs/paginate';
import {
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
  findByQuery(filterQuery: FilterQuery<CommentJson>): Promise<CommentRaw[]>;
}
