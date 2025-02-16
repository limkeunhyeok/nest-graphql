import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { Loader } from '@common/core/decorators/loader.decorator';
import { RoleGuard } from '@common/core/guards/role.guard';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { PostOutput } from '../../../../posts/adapters/graphql/outputs/post.output';
import { PostLoader } from '../../../../posts/applications/loaders/post.loader';
import { UserServicePort } from '../../../ports/in/user.service.port';
import { USER_SERVICE } from '../../../user.const';
import { CreateUserInput } from '../inputs/create.input';
import { ReadUserInput } from '../inputs/read.input';
import { UpdateUserInput } from '../inputs/update.input';
import { PaginateUsersOutput } from '../outputs/paginate.output';
import { UserOutput } from '../outputs/user.output';

@Resolver(() => UserOutput)
export class UserResolver {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserServicePort,
  ) {}

  @Mutation(() => UserOutput)
  @UseGuards(RoleGuard([Role.ADMIN]))
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => UserOutput)
  @UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateById(
      updateUserInput._id,
      updateUserInput,
    );
  }

  @Mutation(() => UserOutput)
  @UseGuards(RoleGuard([Role.ADMIN]))
  async deleteUser(@Args('userId', { type: () => String }) userId: MongoId) {
    return await this.userService.deleteById(userId);
  }

  @Query(() => PaginateUsersOutput)
  @UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
  async paginateUsers(@Args('readUserInput') readUserInput: ReadUserInput) {
    const { _id, role, sortBy, sortOrder, limit, offset } = readUserInput;
    return await this.userService.paginateByQuery(
      {
        _id,
        role,
      },
      { sortBy, sortOrder },
      limit,
      offset,
    );
  }

  @ResolveField(() => [PostOutput])
  async posts(
    @Parent() user: UserOutput,
    @Loader(PostLoader) postLoader: DataLoader<string, PostOutput[]>,
  ) {
    return postLoader.load(user._id.toString());
  }
}
