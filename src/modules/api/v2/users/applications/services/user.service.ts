import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { MongoId } from 'src/@types/datatype';
import { SortQuery } from 'src/common/interfaces/sort.interface';
import {
  EMAIL_IS_ALREADY_REGISTERED,
  ID_DOES_NOT_EXIST,
} from 'src/constants/exception-message.const';
import { SALT_ROUND } from 'src/constants/server.const';
import { paginateResponse, PaginateResponse } from 'src/libs/paginate';
import { sanitizeQuery } from 'src/libs/utils';
import { UserRepository } from '../../adapters/repositories/user.repository';
import {
  UserDomain,
  UserInfo,
  UserJson,
  UserRaw,
} from '../../domain/models/user.domain';
import { UserServicePort } from '../../ports/in/user.service.port';

@Injectable()
export class UserService implements UserServicePort {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(userInfo: UserInfo): Promise<UserJson> {
    const hasUser = await this.userRepository.findOne({
      email: userInfo.email,
    });
    if (hasUser) {
      throw new BadRequestException(EMAIL_IS_ALREADY_REGISTERED);
    }

    const createdUser = await this.userRepository.create({
      ...userInfo,
      password: bcrypt.hashSync(
        userInfo.password,
        this.configService.get(SALT_ROUND),
      ),
    });
    return UserDomain.fromJson(createdUser).toJson();
  }

  async updateById(
    userId: MongoId,
    updateQuery: UpdateQuery<UserRaw>,
  ): Promise<UserJson> {
    const hasUser = await this.userRepository.findById(userId);

    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    const updatedUser = await this.userRepository.updateById(userId, {
      ...updateQuery,
      password: bcrypt.hashSync(
        updateQuery.password,
        this.configService.get(SALT_ROUND),
      ),
    });

    return UserDomain.fromJson(updatedUser).toJson();
  }

  async deleteById(userId: MongoId): Promise<UserJson> {
    const hasUser = await this.userRepository.findById(userId);

    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    const deletedUser = await this.userRepository.deleteById(userId);

    return UserDomain.fromJson(deletedUser).toJson();
  }

  async findOneByEmail(email: string): Promise<UserRaw> {
    const user = await this.userRepository.findOne({ email });
    return UserDomain.fromJson(user);
  }

  async findOneById(userId: MongoId): Promise<UserRaw> {
    const hasUser = await this.userRepository.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }
    return UserDomain.fromJson(hasUser);
  }

  async paginateByQuery(
    filterQuery: FilterQuery<UserJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<UserJson>> {
    const sanitizedFilterQuery = sanitizeQuery(filterQuery);

    const docsPromise = this.userRepository.findDocsPromise(
      sanitizedFilterQuery,
      sortQuery,
      limit,
      offset,
    );

    const totalCountPromise =
      this.userRepository.getTotalCountPromise(sanitizedFilterQuery);

    const [total, docs] = await Promise.all([totalCountPromise, docsPromise]);
    const users = docs.map((doc) => UserDomain.fromJson(doc).toJson());
    return paginateResponse({ total, limit, offset, docs: users });
  }

  async findByQuery(filterQuery: FilterQuery<UserJson>): Promise<UserJson[]> {
    const users = await this.userRepository.find(filterQuery);
    return users.map((user) => UserDomain.fromJson(user).toJson());
  }
}
