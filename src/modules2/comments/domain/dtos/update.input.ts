import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => String)
  postId: MongoId;

  @Field(() => String)
  commentId: MongoId;
}
