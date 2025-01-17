import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationResolver } from './adapters/graphql/resolver/notification.resolver';
import {
  Notification,
  NotificationSchema,
} from './adapters/persistence/entities/notification.entity';
import { NotifcationRepository } from './adapters/persistence/repositories/notification.repository';
import { NotificationService } from './applications/services/notification.service';
import {
  NOTIFICATION_REPOSITORY,
  NOTIFICATION_SERVICE,
} from './notification.const';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  exports: [
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
  ],
  providers: [
    NotificationResolver,
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotifcationRepository,
    },
  ],
})
export class NotificationModule {}
