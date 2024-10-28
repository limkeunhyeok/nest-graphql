import { MongoId } from '@common/core/@types/datatype';
import { SortOrder } from '@common/core/interfaces/sort.interface';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReadCommentInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => Boolean, { nullable: true })
  published?: boolean;

  @Field(() => String, { nullable: true })
  authorId?: MongoId;

  @Field(() => String, { nullable: true })
  postId?: MongoId;

  @Field(() => String, { defaultValue: 'createdAt' })
  sortBy: string;

  @Field(() => String, { defaultValue: SortOrder.DESC })
  sortOrder: SortOrder;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
