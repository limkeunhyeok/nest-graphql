import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PaginateResponse } from 'src/libs/paginate';
import { UserInfo, UserJson, UserRaw } from '../../domain/user.domain';

export interface UserServicePort {
  create(userRaw: UserInfo): Promise<UserJson>;
  updateById(
    userId: MongoId,
    updateQuery: UpdateQuery<UserRaw>,
  ): Promise<UserJson>;
  deleteById(userId: MongoId): Promise<UserJson>;
  findOneByEmail(email: string): Promise<UserRaw>;
  findOneById(userId: MongoId): Promise<UserRaw>;
  paginateByQuery(
    filterQuery: FilterQuery<UserRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<UserJson>>;
  findByQuery(filterQuery: FilterQuery<UserRaw>): Promise<UserRaw[]>;
}
