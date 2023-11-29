import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsBannedGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeaders(request.headers);

    if (!token) {
      throw new UnauthorizedException("You are not authorized");
    }

    try {
      const user = this.jwtService.verify(token) as any;
      if (user.isBanned === true) {
        throw new HttpException("You are banned!!!", HttpStatus.METHOD_NOT_ALLOWED)
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new Error(error)
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authHeader = headers?.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
