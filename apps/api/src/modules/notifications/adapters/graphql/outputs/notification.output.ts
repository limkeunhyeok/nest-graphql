import { ISODateTime, MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NotificationOutput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => String)
  userId: MongoId;

  @Field(() => String)
  postId: MongoId;

  @Field(() => String)
  actorId: MongoId;

  @Field(() => String)
  commentId?: MongoId;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => String)
  contents: string;

  @Field(() => String)
  createdAt: ISODateTime;

  @Field(() => String)
  updatedAt: ISODateTime;
}
