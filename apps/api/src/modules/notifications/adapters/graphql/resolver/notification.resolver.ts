import { MongoId } from '@common/core/@types/datatype';
import { Role } from '@common/core/constants/role.const';
import { RoleGuard } from '@common/core/guards/role.guard';
import { UpdateManyResultOutput } from '@common/core/interfaces/db-result.interface';
import { PUB_SUB } from '@common/modules/pubsub/pubsub.const';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import {
  CREATED_NOTIFICATION,
  NOTIFICATION_SERVICE,
} from '../../../notification.const';
import { NotificationServicePort } from '../../../ports/in/notification.service.port';
import { CreateNotificationInput } from '../inputs/create.input';
import { ReadNotificationInput } from '../inputs/read.input';
import {
  UpdateNotificationInput,
  UpdateNotificationsInput,
} from '../inputs/update.input';
import { NotificationOutput } from '../outputs/notification.output';
import { PaginateNotificationOutput } from '../outputs/paginate.output';

@Resolver(() => NotificationOutput)
@UseGuards(RoleGuard([Role.ADMIN, Role.MEMBER]))
export class NotificationResolver {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServicePort,
    @Inject(PUB_SUB)
    private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => NotificationOutput)
  async createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    const createdNotification = await this.notificationService.create({
      actorId: user.userId,
      ...createNotificationInput,
    });

    this.pubSub.publish(CREATED_NOTIFICATION, {
      CREATED_NOTIFICATION: createdNotification,
    });

    return createdNotification;
  }

  @Mutation(() => NotificationOutput)
  async updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.notificationService.updateById(
      updateNotificationInput._id,
      user.userId,
      updateNotificationInput,
    );
  }

  @Mutation(() => UpdateManyResultOutput)
  async updateNotifications(
    @Args('updateNotificationsInput')
    updateNotificationsInput: UpdateNotificationsInput,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.notificationService.updateMany(
      updateNotificationsInput._ids,
      user.userId,
      { isRead: updateNotificationsInput.isRead },
    );
  }

  @Mutation(() => NotificationOutput)
  async deleteNotification(
    @Args('notificationId', { type: () => String }) notificationId: MongoId,
    @Context() context,
  ) {
    const user = context.req['user'];
    return await this.notificationService.deleteById(
      notificationId,
      user.userId,
    );
  }

  @Query(() => PaginateNotificationOutput)
  async paginateNotifications(
    @Args('readNotificationInput') readNotificationInput: ReadNotificationInput,
  ) {
    const {
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
    } = readNotificationInput;
    return await this.notificationService.paginateByQuery(
      {
        _id,
        userId,
        postId,
        actorId,
        commentId,
        type,
        isRead,
      },
      { sortBy, sortOrder },
      limit,
      offset,
    );
  }

  @Subscription(() => NotificationOutput, {
    name: CREATED_NOTIFICATION,
  })
  createdNotification() {
    return this.pubSub.asyncIterableIterator(CREATED_NOTIFICATION);
  }
}
