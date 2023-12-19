import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MockJwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');

        try {
            const decoded = this.jwtService.verify(token);
            const hasAccess = decoded.roles.includes('user');
            return hasAccess;
        } catch (error) {
            return false;
        }
    }
}
