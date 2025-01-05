import { MongoId } from '@common/core/@types/datatype';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => String)
  postId: MongoId;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;
}
