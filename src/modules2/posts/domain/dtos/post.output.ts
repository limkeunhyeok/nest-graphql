import { Field, ObjectType } from '@nestjs/graphql';
import { ISODateTime, MongoId } from 'src/@types/datatype';

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
