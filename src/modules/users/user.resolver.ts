import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateUserInput } from './dtos/create.input';
import { UpdateUserInput } from './dtos/update.input';
import { Role, User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(RoleGuard([Role.ADMIN]))
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateById(
      updateUserInput._id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  async deleteById(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.userService.deleteById(id);
  }

  @Query(() => [User])
  // @UseGuards(RoleGuard([Role.ADMIN]))
  async findAll(@Context() context) {
    const user = context.req['user'];
    console.log('TESTESTWESTADS!!!!!!!!!!!!!!!!', user);
    return await this.userService.findAll();
  }

  @Query(() => User)
  async getUserById(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.userService.findOneById(id);
  }
}
