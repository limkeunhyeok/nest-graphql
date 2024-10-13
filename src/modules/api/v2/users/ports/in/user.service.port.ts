import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { PaginateResponse } from 'src/libs/paginate';
import { UserInfo, UserJson, UserRaw } from '../../domain/models/user.domain';
import { User } from '../../domain/models/user.entity';

export interface UserServicePort {
  create(userRaw: UserInfo): Promise<UserJson>;
  updateById(
    userId: MongoId,
    updateQuery: UpdateQuery<User>,
  ): Promise<UserJson>;
  deleteById(userId: MongoId): Promise<UserJson>;
  findOneByEmail(email: string): Promise<UserRaw>;
  findOneById(userId: MongoId): Promise<UserRaw>;
  paginateByQuery(
    filterQuery: FilterQuery<User>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<UserJson>>;
}
