import { Field, ObjectType } from '@nestjs/graphql';
import { UserOutput } from './user.output';

@ObjectType()
export class PaginateUsersOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [UserOutput])
  docs: UserOutput[];
}
