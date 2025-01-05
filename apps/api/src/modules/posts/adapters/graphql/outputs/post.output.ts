import { ISODateTime, MongoId } from '@common/core/@types/datatype';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostOutput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => String)
  authorId: MongoId;

  @Field(() => String)
  createdAt: ISODateTime;

  @Field(() => String)
  updatedAt: ISODateTime;
}
