import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class PaginateUsersOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [User])
  docs: User[];
}
