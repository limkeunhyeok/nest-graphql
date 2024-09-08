import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('PUBLIC!!!!');
      return true;
    }

    const contextType = context.getType<GqlContextType>();
    if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);

      const req: IncomingMessage = gqlContext.getContext<any>().req;

      const token = this.extractTokenFromHeader(req);
      if (!token) {
        throw new UnauthorizedException('Invalid token.');
      }

      try {
        const decoded = this.jwtService.verify(token);
        req['user'] = decoded;
      } catch (err) {
        throw new UnauthorizedException(err);
      }
    }
    return true;
  }

  private extractTokenFromHeader(req: IncomingMessage): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
