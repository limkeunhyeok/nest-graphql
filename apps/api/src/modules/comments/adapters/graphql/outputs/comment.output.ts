import { ISODateTime, MongoId } from '@common/core/@types/datatype';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentOutput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => String)
  postId: MongoId;

  @Field(() => String)
  authorId: MongoId;

  @Field(() => String)
  createdAt: ISODateTime;

  @Field(() => String)
  updatedAt: ISODateTime;
}
