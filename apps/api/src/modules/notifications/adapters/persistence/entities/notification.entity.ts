import { MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, _id: true })
export class Notification {
  _id: MongoId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  userId: MongoId; // 게시글 작성자

  @Prop({ required: true, type: Types.ObjectId, ref: 'posts' })
  postId: MongoId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'users' })
  actorId: MongoId; // 댓글 작성자 또는 좋아요 누른 사용자

  @Prop({ required: false, type: Types.ObjectId, ref: 'comments' })
  commentId?: MongoId;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.COMMENT,
  })
  type: NotificationType;

  @Prop({ required: true, type: Boolean })
  isRead: boolean;

  @Prop({ required: true, type: String })
  contents: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
