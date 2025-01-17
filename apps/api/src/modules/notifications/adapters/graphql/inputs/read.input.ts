import { MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { SortOrder } from '@common/core/interfaces/sort.interface';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReadNotificationInput {
  @Field(() => String, { nullable: true })
  _id?: MongoId;

  @Field(() => String, { nullable: true })
  userId?: MongoId;

  @Field(() => String, { nullable: true })
  postId?: MongoId;

  @Field(() => String, { nullable: true })
  actorId?: MongoId;

  @Field(() => String, { nullable: true })
  commentId?: MongoId;

  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType;

  @Field(() => Boolean, { nullable: true })
  isRead?: boolean;

  @Field(() => String, { defaultValue: 'createdAt' })
  sortBy: string;

  @Field(() => String, { defaultValue: SortOrder.DESC })
  sortOrder: SortOrder;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}
