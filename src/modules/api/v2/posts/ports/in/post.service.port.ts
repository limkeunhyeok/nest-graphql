import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PaginateResponse } from 'src/libs/paginate';
import { PostInfo, PostJson } from '../../domain/models/post.domain';
import { Post } from '../../domain/models/post.entity';

export interface PostServicePort {
  create(postRaw: PostInfo): Promise<PostJson>;
  updateById(
    postId: MongoId,
    authorId: MongoId,
    updateQuery: UpdateQuery<Post>,
  ): Promise<PostJson>;
  deleteById(postId: MongoId, authorId: MongoId): Promise<PostJson>;
  paginateByQuery(
    filterQuery: FilterQuery<Post>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<PostJson>>;
  findByQuery(filterQuery: FilterQuery<PostJson>): Promise<PostJson[]>;
}
