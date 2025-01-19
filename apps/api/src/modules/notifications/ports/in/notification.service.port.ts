import { MongoId } from '@common/core/@types/datatype';
import { UpdateManyResult } from '@common/core/interfaces/db-result.interface';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { PaginateResponse } from '@common/utils/paginate';
import { FilterQuery, UpdateQuery } from 'mongoose';
import {
  NotificationDomain,
  NotificationInfo,
  NotificationJson,
  NotificationRaw,
} from '../../domain/notification.domain';

export interface NotificationServicePort {
  create(notificationRaw: NotificationInfo): Promise<NotificationJson>;
  updateById(
    notificationId: MongoId,
    userId: MongoId,
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<NotificationJson>;
  updateMany(
    notificationIds: MongoId[],
    userId: MongoId,
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<UpdateManyResult>;
  deleteById(
    notificationId: MongoId,
    userId: MongoId,
  ): Promise<NotificationJson>;
  paginateByQuery(
    filterQuery: FilterQuery<NotificationRaw>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<PaginateResponse<NotificationJson>>;
  findByQuery(
    filterQuery: FilterQuery<NotificationJson>,
  ): Promise<NotificationDomain[]>;
}
