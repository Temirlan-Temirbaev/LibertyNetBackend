import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeaders(request.headers);

        if (!token) {
            return false;
        }

        try {
            const user = this.jwtService.verify(token) as any;
            request.user = user;
            return true;
        } catch (error) {
            return false;
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
