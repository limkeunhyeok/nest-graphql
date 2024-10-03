import { Field, InputType, Int } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';
import { SortOrder } from 'src/common/interfaces/sort.interface';

@InputType()
export class ReadPostInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => Boolean, { nullable: true })
  published?: boolean;

  @Field(() => String, { nullable: true })
  authorId?: MongoId;

  @Field(() => String, { defaultValue: 'createdAt' })
  sortBy: string;

  @Field(() => String, { defaultValue: SortOrder.DESC })
  sortOrder: SortOrder;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
