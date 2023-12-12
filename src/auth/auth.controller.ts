import { Body, Controller, Get, Post, Headers, UseGuards, Put, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "../user/dto/create-user.dto"
import { LoginDto } from "./dto/login.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { User } from "../entities/user"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Registration" })
  @ApiResponse({ status: 200, type: String })
  @Post("register")
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user)
  }

  @ApiOperation({ summary: "Login" })
  @ApiResponse({ status: 200, type: String })
  @Post("login")
  login(@Body() user: LoginDto) {
    return this.authService.login(user)
  }

  @ApiOperation({ summary: "Edit Profile" })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Put("profile")
  edit(@Body() user: Partial<CreateUserDto>, @Req() req: { user: User }) {
    return this.authService.edit(user, req.user)
  }

  @ApiOperation({ summary: "Get user data by token" })
  @ApiResponse({ status: 200, type: User })
  @Get("check-login")
  @UseGuards(JwtAuthGuard)
  checkLogin(@Headers("Authorization") authorization: string) {
    return this.authService.getUserByJwt(authorization)
  }
}
