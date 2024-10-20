import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseRepository } from 'src/common/abstract/base.repository';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import { UserJson } from '../../../domain/user.domain';
import { UserRepositoryPort } from '../../../ports/out/user.repository.port';
import { User, UserDocument } from '../entities/user.entity';

@Injectable()
export class UserRepository
  extends BaseRepository<UserDocument>
  implements UserRepositoryPort
{
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  getTotalCountPromise(filterQuery: FilterQuery<UserJson>): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  findDocsPromise(
    filterQuery: FilterQuery<UserJson>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<UserDocument[]> {
    return this.model
      .find(filterQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
