import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/users/entities/user.entity';

export const RoleGuard = (roles: Role[]): Type<CanActivate> => {
  @Injectable()
  class UserGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      if (!roles.length) {
        return true;
      }
      const gqlContext = GqlExecutionContext.create(context);
      const req: Request = gqlContext.getContext().req;

      const { role } = req['user'];

      if (!roles.includes(role)) {
        throw new ForbiddenException('Access is denied.');
      }

      return true;
    }
  }

  const guard = mixin(UserGuard);
  return guard;
};
