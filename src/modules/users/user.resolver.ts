import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Schema as MongooseSchema } from 'mongoose';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Post } from '../posts/entities/post.entity';
import { PostService } from '../posts/post.service';
import { CreateUserInput } from './dtos/create.input';
import { UpdateUserInput } from './dtos/update.input';
import { Role, User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Mutation(() => User)
  @UseGuards(RoleGuard([Role.ADMIN]))
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return await this.userService.updateById(
      updateUserInput._id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  @UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
  async deleteUser(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.userService.deleteById(id);
  }

  @Query(() => [User])
  @UseGuards(RoleGuard([Role.ADMIN]))
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(RoleGuard([Role.ADMIN]))
  async getUserById(
    @Args('id', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ) {
    return await this.userService.findOneById(id);
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    const { _id } = user;
    return await this.postService.findByQuery({ authorId: _id });
  }
}
