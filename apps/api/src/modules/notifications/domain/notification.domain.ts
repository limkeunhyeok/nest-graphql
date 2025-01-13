import { ISODateTime, MongoId } from '@common/core/@types/datatype';
import { NotificationType } from '@common/core/constants/notification.const';
import { BaseDomain } from '@common/core/interfaces/domain.interface';

export interface NotificationRaw {
  readonly _id: MongoId;
  readonly userId: MongoId; // 게시글 작성자
  readonly postId: MongoId;
  readonly actorId: MongoId; // 댓글 작성자 또는 좋아요 누른 사용자
  readonly commentId?: MongoId;
  readonly type: NotificationType;
  readonly isRead: boolean;
  readonly contents: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NotificationJson {
  readonly _id: MongoId;
  readonly userId: MongoId;
  readonly postId: MongoId;
  readonly actorId: MongoId;
  readonly commentId?: MongoId;
  readonly type: NotificationType;
  readonly isRead: boolean;
  readonly contents: string;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
}

export interface NotificationInfo {
  readonly userId: MongoId;
  readonly postId: MongoId;
  readonly actorId: MongoId;
  readonly commentId?: MongoId;
  readonly type: NotificationType;
  readonly isRead: boolean;
  readonly contents: string;
}

export class NotificationDomain implements BaseDomain<NotificationJson> {
  constructor(
    public readonly _id: MongoId,
    public readonly userId: MongoId,
    public readonly postId: MongoId,
    public readonly actorId: MongoId,
    public readonly type: NotificationType,
    public readonly isRead: boolean,
    public readonly contents: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly commentId?: MongoId,
  ) {}

  static fromJson(json: NotificationRaw) {
    if (!json) {
      return null;
    }

    return new NotificationDomain(
      json._id,
      json.userId,
      json.postId,
      json.actorId,
      json.type,
      json.isRead,
      json.contents,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.commentId,
    );
  }

  public toJson(): NotificationJson {
    return {
      _id: this._id,
      userId: this.userId,
      postId: this.postId,
      actorId: this.actorId,
      commentId: this.commentId,
      type: this.type,
      isRead: this.isRead,
      contents: this.contents,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
