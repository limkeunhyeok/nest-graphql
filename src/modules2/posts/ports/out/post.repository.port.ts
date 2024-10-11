import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PostInfo, PostJson, PostRaw } from '../../domain/models/post.domain';
import { PostDocument } from '../../domain/models/post.entity';

export interface PostRepositoryPort {
  findById(id: MongoId): Promise<PostDocument | null>;
  find(filterQuery: FilterQuery<PostJson>): Promise<PostDocument[]>;
  findOne(filterQuery: FilterQuery<PostJson>): Promise<PostDocument>;
  create(data: PostInfo): Promise<PostDocument>;
  updateById(id: MongoId, data: UpdateQuery<PostRaw>): Promise<PostDocument>;
  deleteById(id: MongoId): Promise<PostDocument>;
  getTotalCountPromise(filterQuery: FilterQuery<PostJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<PostJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PostDocument[]>;
}
