import { MongoId } from '@common/core/@types/datatype';
import {
  ACCESS_IS_DENIED,
  ID_DOES_NOT_EXIST,
} from '@common/core/constants/exception-message.const';
import { UpdateManyResult } from '@common/core/interfaces/db-result.interface';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { paginateResponse, PaginateResponse } from '@common/utils/paginate';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  NotificationDomain,
  NotificationInfo,
  NotificationJson,
  NotificationRaw,
} from '../../domain/notification.domain';
import { NOTIFICATION_REPOSITORY } from '../../notification.const';
import { NotificationServicePort } from '../../ports/in/notification.service.port';
import { NotificationRepositoryPort } from '../../ports/out/notification.repository.port';

@Injectable()
export class NotificationService implements NotificationServicePort {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
  ) {}

  async create(notificationInfo: NotificationInfo): Promise<NotificationJson> {
    const createdNotification = await this.notificationRepository.create({
      ...notificationInfo,
    });

    return createdNotification.toJson();
  }

  async updateById(
    notificationId: MongoId,
    userId: MongoId,
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<NotificationJson> {
    const hasNotification = await this.notificationRepository.findById(
      notificationId,
    );

    if (!hasNotification) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (hasNotification.userId !== userId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const updatedNotification = await this.notificationRepository.updateById(
      notificationId,
      updateQuery,
    );

    return updatedNotification.toJson();
  }

  async updateMany(
    notificationIds: MongoId[],
    userId: MongoId,
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<UpdateManyResult> {
    const validNotifications = await this.notificationRepository.find({
      _id: { $in: notificationIds },
      userId,
    });

    const validIds = validNotifications.map((doc) => doc._id.toString());
    const failedIds = notificationIds.filter(
      (id) => !validIds.includes(id.toString()),
    );

    await this.notificationRepository.updateMany(validIds, updateQuery);
    return {
      successIds: validIds,
      failedIds,
      totalProcessed: notificationIds.length,
    };
  }

  async deleteById(
    notificationId: MongoId,
    userId: MongoId,
  ): Promise<NotificationJson> {
    const hasNotification = await this.notificationRepository.findById(
      notificationId,
    );

    if (!hasNotification) {
      throw new BadRequestException(ID_DOES_NOT_EXIST);
    }

    if (hasNotification.userId !== userId) {
      throw new ForbiddenException(ACCESS_IS_DENIED);
    }

    const deletedNotification = await this.notificationRepository.deleteById(
      notificationId,
    );

    return deletedNotification.toJson();
  }

  async paginateByQuery(
    filterQuery: FilterQuery<NotificationRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<NotificationJson>> {
    const { total, docs } = await this.notificationRepository.getTotalAndDocs(
      filterQuery,
      sortQuery,
      limit,
      offset,
    );
    return paginateResponse({ total, limit, offset, docs });
  }

  async findByQuery(
    filterQuery: FilterQuery<NotificationJson>,
  ): Promise<NotificationDomain[]> {
    const notifications = await this.notificationRepository.find(filterQuery);
    return notifications;
  }
}
