import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => Boolean)
  published: boolean;
}
