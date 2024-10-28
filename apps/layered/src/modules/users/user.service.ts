import { MongoId } from '@common/core/@types/datatype';
import {
  EMAIL_IS_ALREADY_REGISTERED,
  ID_DOES_NOT_EXIST,
} from '@common/core/constants/exception-message.const';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import {
  encryptPassword,
  paginateResponse,
  PaginateResponse,
} from '@common/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userRaw: Partial<User>): Promise<UserDocument> {
    const hasUser = await this.userModel
      .findOne({ email: userRaw.email })
      .exec();
    if (hasUser) {
      throw new BadRequestException(EMAIL_IS_ALREADY_REGISTERED);
    }

    const createdUser = new this.userModel({
      ...userRaw,
      password: encryptPassword(userRaw.password),
    });
    return await createdUser.save();
  }

  async updateById(
    userId: MongoId,
    updateQuery: UpdateQuery<User>,
  ): Promise<UserDocument> {
    const hasUser = await this.userModel.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    return await this.userModel
      .findByIdAndUpdate(
        userId,
        { ...updateQuery, password: encryptPassword(updateQuery.password) },
        {
          new: true,
        },
      )
      .exec();
  }

  async deleteById(userId: MongoId): Promise<UserDocument> {
    const hasUser = await this.userModel.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    return await this.userModel
      .findByIdAndDelete(userId, {
        new: true,
      })
      .exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async findOneById(userId: MongoId) {
    const hasUser = this.userModel.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }
    return hasUser;
  }

  async paginateByQuery(
    filterQuery: FilterQuery<User>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<User>> {
    const sanitizedFilterQuery = this.sanitizeQuery(filterQuery);

    const docsPromise = this.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise = this.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    return paginateResponse({ total, limit, offset, docs });
  }

  private getTotalCountPromise(
    filterQuery: FilterQuery<User>,
  ): Promise<number> {
    return this.userModel.countDocuments(filterQuery).exec();
  }

  private findDocsPromise(
    filterQuery: FilterQuery<User>,
    { sortBy, sortOrder }: SortQuery,
    limit: number,
    offset: number,
  ): Promise<UserDocument[]> {
    return this.userModel
      .find(filterQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  private sanitizeQuery(query: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined),
    );
  }
}
