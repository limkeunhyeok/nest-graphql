import { registerEnumType } from '@nestjs/graphql';

export const NotificationType = {
  COMMENT: 'COMMENT',
  LIKE: 'LIKE',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

registerEnumType(NotificationType, {
  name: 'NotificationType',
});
