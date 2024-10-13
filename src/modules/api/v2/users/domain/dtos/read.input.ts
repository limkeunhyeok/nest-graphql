import { Field, InputType, Int } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { SortOrder } from 'src/common/interfaces/sort.interface';
import { Role } from 'src/constants/role.const';

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
