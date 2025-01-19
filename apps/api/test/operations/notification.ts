import { MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { SortOrder } from '@common/core/interfaces/sort.interface';
import { UPDATE_MANY_RESULT_FIELDS } from './common';

export const NOTIFICATION_FIELDS = `{
  _id
  userId
  postId
  actorId
  commentId
  type
  isRead
  contents
  createdAt
  updatedAt
}`;

// paginate notifications
export const PAGINATE_NOTIFICATIONS_FIELDS = `{
  total
  limit
  offset
  docs ${NOTIFICATION_FIELDS}
}`;
export const PAGINATE_NOTIFICATIONS_OPERATION = 'paginateNotifications';
export const PAGINATE_NOTIFICATIONS_QUERY = `query PaginateNotifications($readNotificationInput: ReadNotificationInput!) {
  paginateNotifications(readNotificationInput: $readNotificationInput) ${PAGINATE_NOTIFICATIONS_FIELDS}
}`;
export const generatePaginateNotificationsInput = ({
  _id,
  userId,
  postId,
  actorId,
  commentId,
  type,
  isRead,
  sortBy,
  sortOrder,
  limit,
  offset,
}: {
  _id?: MongoId;
  userId?: MongoId;
  postId?: MongoId;
  actorId?: MongoId;
  commentId?: MongoId;
  type?: NotificationType;
  isRead?: boolean;
  sortBy: string;
  sortOrder: SortOrder;
  limit: number;
  offset: number;
}) => ({
  readNotificationInput: {
    _id,
    userId,
    postId,
    actorId,
    commentId,
    type,
    isRead,
    sortBy,
    sortOrder,
    limit,
    offset,
  },
});

// update notification
export const UPDATE_NOTIFICATION_OPERATION = 'updateNotification';
export const UPDATE_NOTIFICATION_QUERY = `mutation UpdateNotification($updateNotificationInput: UpdateNotificationInput!) {
  updateNotification(updateNotificationInput: $updateNotificationInput) ${NOTIFICATION_FIELDS}
}`;
export const generateUpdateNotificationInput = (
  _id: MongoId,
  isRead: boolean,
) => ({
  updateNotificationInput: {
    _id,
    isRead,
  },
});

// update notifications
export const UPDATE_NOTIFICATIONS_OPERATION = 'updateNotifications';
export const UPDATE_NOTIFICATIONS_QUERY = `mutation UpdateNotifications($updateNotificationsInput: UpdateNotificationsInput!) {
  updateNotifications(updateNotificationsInput: $updateNotificationsInput) ${UPDATE_MANY_RESULT_FIELDS}
}`;
export const generateUpdateNotificationsInput = (
  _ids: MongoId[],
  isRead: boolean,
) => ({
  updateNotificationsInput: {
    _ids,
    isRead,
  },
});

// delete notification
export const DELETE_NOTIFICATION_OPERATION = 'deleteNotification';
export const DELETE_NOTIFICATION_QUERY = `mutation DeleteNotification($notificationId: String!) {
  deleteNotification(notificationId: $notificationId) ${NOTIFICATION_FIELDS}
}`;
export const generateDeleteNotificationInput = (notificationId: MongoId) => ({
  notificationId,
});
