import { MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  userId: MongoId;

  @Field(() => String)
  postId: MongoId;

  @Field(() => String, { nullable: true })
  commentId?: MongoId;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field(() => Boolean)
  isRead: boolean;

  @Field(() => String)
  contents: string;
}
