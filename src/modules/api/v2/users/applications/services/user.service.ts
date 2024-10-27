import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
import {
  UserDomain,
  UserInfo,
  UserJson,
  UserRaw,
} from '../../domain/user.domain';
import { UserServicePort } from '../../ports/in/user.service.port';
import { UserRepositoryPort } from '../../ports/out/user.repository.port';
import { USER_REPOSITORY } from '../../user.const';

@Injectable()
export class UserService implements UserServicePort {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
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
    return createdUser.toJson();
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

    return updatedUser.toJson();
  }

  async deleteById(userId: MongoId): Promise<UserJson> {
    const hasUser = await this.userRepository.findById(userId);

    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    const deletedUser = await this.userRepository.deleteById(userId);

    return deletedUser.toJson();
  }

  async findOneByEmail(email: string): Promise<UserDomain> {
    return await this.userRepository.findOne({ email });
  }

  async findOneById(userId: MongoId): Promise<UserDomain> {
    const hasUser = await this.userRepository.findById(userId);
    if (!hasUser) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }
    return hasUser;
  }

  async paginateByQuery(
    filterQuery: FilterQuery<UserRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<UserJson>> {
    const { total, docs } = await this.userRepository.getTotalAndDocs(
      filterQuery,
      sortQuery,
      limit,
      offset,
    );
    return paginateResponse({ total, limit, offset, docs });
  }

  async findByQuery(filterQuery: FilterQuery<UserRaw>): Promise<UserDomain[]> {
    const users = await this.userRepository.find(filterQuery);
    return users;
  }
}
