import { MongoId } from '@common/core/@types/datatype';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { PaginateResponse } from '@common/utils/paginate';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  UserDomain,
  UserInfo,
  UserJson,
  UserRaw,
} from '../../domain/user.domain';

export interface UserServicePort {
  create(userRaw: UserInfo): Promise<UserJson>;
  updateById(
    userId: MongoId,
    updateQuery: UpdateQuery<UserRaw>,
  ): Promise<UserJson>;
  deleteById(userId: MongoId): Promise<UserJson>;
  findOneByEmail(email: string): Promise<UserDomain>;
  findOneById(userId: MongoId): Promise<UserDomain>;
  paginateByQuery(
    filterQuery: FilterQuery<UserRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<UserJson>>;
  findByQuery(filterQuery: FilterQuery<UserRaw>): Promise<UserDomain[]>;
}
