import { Field, ObjectType } from '@nestjs/graphql';
import { NotificationOutput } from './notification.output';

@ObjectType()
export class PaginateNotificationOutput {
  @Field(() => Number)
  total: number;

  @Field(() => Number)
  limit: number;

  @Field(() => Number)
  offset: number;

  @Field(() => [NotificationOutput])
  docs: NotificationOutput[];
}
