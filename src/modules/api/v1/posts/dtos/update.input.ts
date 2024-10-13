import { Field, InputType } from '@nestjs/graphql';
import { MongoId } from 'src/@types/datatype';

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
