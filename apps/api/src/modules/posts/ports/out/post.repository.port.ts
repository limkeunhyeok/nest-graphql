import { MongoId } from '@common/core/@types/datatype';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  PostDomain,
  PostInfo,
  PostJson,
  PostRaw,
} from '../../domain/post.domain';

export interface PostRepositoryPort {
  findById(id: MongoId): Promise<PostDomain | null>;
  find(filterQuery: FilterQuery<PostJson>): Promise<PostDomain[]>;
  findOne(filterQuery: FilterQuery<PostJson>): Promise<PostDomain>;
  create(data: PostInfo): Promise<PostDomain>;
  updateById(
    id: MongoId,
    data: UpdateQuery<PostRaw>,
  ): Promise<PostDomain | null>;
  deleteById(id: MongoId): Promise<PostDomain | null>;
  getTotalCountPromise(filterQuery: FilterQuery<PostJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<PostJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PostRaw[]>;
  getTotalAndDocs(
    filterQuery: FilterQuery<PostJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<{ total: number; docs: PostJson[] }>;
}
