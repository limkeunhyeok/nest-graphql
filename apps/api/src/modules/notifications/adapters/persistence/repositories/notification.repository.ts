import { MongoId } from '@common/core/@types/datatype';
import { BaseRepository } from '@common/core/abstract/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import {
  NotificationDomain,
  NotificationJson,
  NotificationRaw,
} from '../../../domain/notification.domain';
import { NotificationRepositoryPort } from '../../../ports/out/notification.repository.port';
import { NotificationDocument } from '../entities/notification.entity';

@Injectable()
export class NotifcationRepository
  extends BaseRepository<
    NotificationDocument,
    NotificationRaw,
    NotificationJson,
    NotificationDomain
  >
  implements NotificationRepositoryPort
{
  constructor(
    @InjectModel(Notification.name)
    notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel, NotificationDomain);
  }

  async updateMany(
    ids: MongoId[],
    updateQuery: UpdateQuery<NotificationRaw>,
  ): Promise<any> {
    return await this.model.updateMany({ _id: { $in: ids } }, updateQuery);
  }
}
