import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PaginateResponse } from 'src/libs/paginate';
import {
  PostDomain,
  PostInfo,
  PostJson,
  PostRaw,
} from '../../domain/post.domain';

export interface PostServicePort {
  create(postRaw: PostInfo): Promise<PostJson>;
  updateById(
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<PostRaw>,
  ): Promise<PostJson>;
  deleteById(postId: MongoId, authorId: MongoId): Promise<PostJson>;
  paginateByQuery(
    filterQuery: FilterQuery<PostRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<PostJson>>;
  findByQuery(filterQuery: FilterQuery<PostJson>): Promise<PostDomain[]>;
}
