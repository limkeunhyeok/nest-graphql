import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { SortOrder } from '@common/core/interfaces/sort.interface';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReadUserInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => String, { nullable: true })
  role?: Role;

  @Field(() => String, { defaultValue: 'createdAt' })
  sortBy: string;

  @Field(() => String, { defaultValue: SortOrder.DESC })
  sortOrder: SortOrder;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
