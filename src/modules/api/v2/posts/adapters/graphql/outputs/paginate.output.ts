import { Field, ObjectType } from '@nestjs/graphql';
import { PostOutput } from './post.output';

@ObjectType()
export class PaginatePostOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [PostOutput])
  docs: PostOutput[];
}
