import { MongoId } from '@common/core/@types/datatype';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  _id: MongoId;

  @Field(() => Boolean)
  isRead: boolean;
}

@InputType()
export class UpdateNotificationsInput {
  @Field(() => [String])
  _ids: MongoId[];

  @Field(() => Boolean)
  isRead: boolean;
}
