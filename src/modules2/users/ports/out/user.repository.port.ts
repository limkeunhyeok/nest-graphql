import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { UserInfo, UserJson, UserRaw } from '../../domain/models/user.domain';
import { UserDocument } from '../../domain/models/user.entity';

export interface UserRepositoryPort {
  findById(id: MongoId): Promise<UserDocument | null>;
  find(filterQuery: FilterQuery<UserJson>): Promise<UserDocument[]>;
  findOne(filterQuery: FilterQuery<UserJson>): Promise<UserDocument>;
  create(data: UserInfo): Promise<UserDocument>;
  updateById(id: MongoId, data: UpdateQuery<UserRaw>): Promise<UserDocument>;
  deleteById(id: MongoId): Promise<UserDocument>;
  getTotalCountPromise(filterQuery: FilterQuery<UserJson>): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<UserJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<UserDocument[]>;
}