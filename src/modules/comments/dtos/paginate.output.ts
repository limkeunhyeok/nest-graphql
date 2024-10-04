import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';

@ObjectType()
export class PaginateCommentOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [Comment])
  docs: Comment[];
}
