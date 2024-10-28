import { Field, ObjectType } from '@nestjs/graphql';
import { CommentOutput } from './comment.output';

@ObjectType()
export class PaginateCommentOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [CommentOutput])
  docs: CommentOutput[];
}
