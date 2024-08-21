import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      const info = gqlContext.getInfo();

      const operationName = info.fieldName;
      if (operationName === 'login' || operationName === 'signup') {
        return next.handle();
      }

      const req: Request = gqlContext.getContext().req;
      const authHeaders = req.headers.authorization;
      if (authHeaders && authHeaders.split(' ')[1]) {
        const token = authHeaders.split(' ')[1];

        try {
          const decoded = this.jwtService.verify(token);
          req['user'] = { userId: decoded.userId };
        } catch (error) {
          throw new UnauthorizedException('Invalid token.');
        }
      }
      return next.handle();
    }
    return next.handle();
  }
}
