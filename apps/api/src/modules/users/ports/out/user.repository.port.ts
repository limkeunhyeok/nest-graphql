import { MongoId } from '@common/core/@types/datatype';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  UserDomain,
  UserInfo,
  UserJson,
  UserRaw,
} from '../../domain/user.domain';

export interface UserRepositoryPort {
  findById(id: MongoId): Promise<UserDomain | null>;
  find(filterQuery: FilterQuery<UserJson>): Promise<UserDomain[]>;
  findOne(filterQuery: FilterQuery<UserJson>): Promise<UserDomain>;
  create(data: UserInfo): Promise<UserDomain>;
  updateById(id: MongoId, data: UpdateQuery<UserRaw>): Promise<UserDomain>;
  deleteById(id: MongoId): Promise<UserDomain>;
  getTotalCountPromise(filterQuery: FilterQuery<UserJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<UserJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<UserRaw[]>;
  getTotalAndDocs(
    filterQuery: FilterQuery<UserJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<{ total: number; docs: UserJson[] }>;
}
