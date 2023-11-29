import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private jwtService: JwtService, private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();

    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRole) {
      return true;
    }

    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(" ")[0]
    const token = authHeader.split(" ")[1]

    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("You are not authorized");
    }

    const user = this.jwtService.verify(token);
    request.user = user;
    if (!requiredRole.includes(user.role)) {
      throw new HttpException("You have no rights", HttpStatus.METHOD_NOT_ALLOWED)
    }
    return requiredRole.includes(user.role);

  }
}