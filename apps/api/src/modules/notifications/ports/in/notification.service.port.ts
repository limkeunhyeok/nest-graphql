import { MongoId } from '@common/core/@types/datatype';
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
  create(NotificationRaw: NotificationInfo): Promise<NotificationJson>;
  updateById(
    notificationId: MongoId,
    userId: MongoId,
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<NotificationJson>;
  deleteById(
    notificationId: MongoId,
    authorId: MongoId,
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
