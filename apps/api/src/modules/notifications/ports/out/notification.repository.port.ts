import { MongoId } from '@common/core/@types/datatype';
import { SortQuery } from '@common/core/interfaces/sort.interface';
import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import {
  NotificationDomain,
  NotificationInfo,
  NotificationJson,
  NotificationRaw,
} from '../../domain/notification.domain';

export interface NotificationRepositoryPort {
  findById(id: MongoId): Promise<NotificationDomain | null>;
  find(
    filterQuery: FilterQuery<NotificationJson>,
  ): Promise<NotificationDomain[]>;
  findOne(
    filterQuery: FilterQuery<NotificationJson>,
  ): Promise<NotificationDomain>;
  create(data: NotificationInfo): Promise<NotificationDomain>;
  updateById(
    id: MongoId,
    data: UpdateQuery<NotificationRaw>,
  ): Promise<NotificationDomain | null>;
  updateMany(
    ids: MongoId[],
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<UpdateWriteOpResult>;
  deleteById(id: MongoId): Promise<NotificationDomain | null>;
  getTotalCountPromise(
    filterQuery: FilterQuery<NotificationJson>,
  ): Promise<number>;
  findDocsPromise(
    filterQuery: FilterQuery<NotificationJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<NotificationRaw[]>;
  getTotalAndDocs(
    filterQuery: FilterQuery<NotificationJson>,
    sortQuery: SortQuery,
    limit: number,
    offset: number,
  ): Promise<{ total: number; docs: NotificationJson[] }>;
}
