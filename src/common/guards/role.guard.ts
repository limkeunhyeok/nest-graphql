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
import { ACCESS_IS_DENIED } from 'src/constants/exception-message.const';
import { Role } from 'src/constants/role.const';

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
        throw new ForbiddenException(ACCESS_IS_DENIED);
      }

      return true;
    }
  }

  const guard = mixin(UserGuard);
  return guard;
};
