import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = this.extractTokenFromHeader(request);
    if (!email) {
      throw new UnauthorizedException();
    }

    request['user'] = email;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization || '';
  }
}
