import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { User } from "../../entities/user"

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeaders(request.headers)

    if (!token) {
      throw new UnauthorizedException("You are not authorized")
    }

    try {
      const user = this.jwtService.verify(token) as User
      request.user = user
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  private extractTokenFromHeaders(headers: any): string | null {
    const authHeader = headers?.authorization
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      return authHeader.split(" ")[1]
    }
    return null
  }
}
