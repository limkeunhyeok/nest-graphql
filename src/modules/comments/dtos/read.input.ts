import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';

@InputType()
export class ReadCommentInput {
  @Field(() => Boolean, { nullable: true })
  published?: boolean;

  @Field(() => String, { nullable: true })
  authorId?: MongoId;

  @Field(() => String, { nullable: true })
  postId?: MongoId;
}
