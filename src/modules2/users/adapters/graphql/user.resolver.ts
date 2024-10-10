import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from '../../../../constants/role.const';
import { CreateUserInput } from '../../domain/dtos/create.input';
import { PaginateUsersOutput } from '../../domain/dtos/paginate.output';
import { ReadUserInput } from '../../domain/dtos/read.input';
import { UpdateUserInput } from '../../domain/dtos/update.input';
import { UserOutput } from '../../domain/dtos/user.output';
import { UserService } from '../../domain/services/user.service';

@Resolver(() => UserOutput)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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
  // @UseGuards(RoleGuard([Role.ADMIN]))
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
}
