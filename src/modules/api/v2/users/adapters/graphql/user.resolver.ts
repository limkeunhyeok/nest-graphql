import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader';
import { MongoId } from 'src/@types/datatype';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/constants/role.const';
import { PostOutput } from '../../../posts/adapters/dtos/post.output';
import { PostLoader } from '../../../posts/domain/loaders/post.loader';
import { UserService } from '../../domain/services/user.service';
import { CreateUserInput } from '../dtos/create.input';
import { PaginateUsersOutput } from '../dtos/paginate.output';
import { ReadUserInput } from '../dtos/read.input';
import { UpdateUserInput } from '../dtos/update.input';
import { UserOutput } from '../dtos/user.output';

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
    @Loader(PostLoader) postLoader: Loader<string, PostOutput[]>,
  ) {
    return postLoader.load(user._id.toString());
  }
}
