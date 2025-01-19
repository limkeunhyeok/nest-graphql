import { MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { Notification } from 'apps/api/src/modules/notifications/adapters/persistence/entities/notification.entity';
import * as faker from 'faker';
import * as mongoose from 'mongoose';

export function mockNotificationRaw({
  userId,
  postId,
  actorId,
  commentId,
  type = NotificationType.COMMENT,
  isRead = false,
}: {
  userId?: MongoId;
  postId: MongoId;
  actorId: MongoId;
  commentId?: MongoId;
  type?: NotificationType;
  isRead?: boolean;
}): Partial<Notification> {
  const now = new Date();
  const partialNotification = {
    postId,
    actorId,
    commentId,
    type,
    isRead,
    contents: faker.lorem.sentence(),
    createdAt: now,
    updatedAt: now,
  };

  if (userId) {
    return {
      ...partialNotification,
      userId,
    };
  }
  return partialNotification;
}

export async function createNotification(
  notificationModel: mongoose.Model<Notification>,
  userId: MongoId,
  postId: MongoId,
  actorId: MongoId,
  commentId: MongoId,
  notificationRaw = mockNotificationRaw({ userId, postId, actorId, commentId }),
) {
  const data: Partial<Notification> = JSON.parse(
    JSON.stringify(notificationRaw),
  );
  return await notificationModel.create(data);
}
