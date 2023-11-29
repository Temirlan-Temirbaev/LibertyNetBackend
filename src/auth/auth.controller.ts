import {Body, Controller, Get, Post, Headers, UseGuards} from "@nestjs/common"
import {AuthService} from "./auth.service"
import {CreateUserDto} from "../user/dto/create-user.dto"
import {LoginDto} from "./dto/login.dto"
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post("register")
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user)
  }

  @Post("login")
  login(@Body() user: LoginDto) {
    return this.authService.login(user)
  }

  @Get("check-login")
  @UseGuards(JwtAuthGuard)
  checkLogin(@Headers("Authorization") authorization: string) {
    return this.authService.getUserByJwt(authorization)
  }
}
