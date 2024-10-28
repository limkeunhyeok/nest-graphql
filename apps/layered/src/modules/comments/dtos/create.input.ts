import { MongoId } from '@common/core/@types/datatype';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => String)
  postId: MongoId;
}
