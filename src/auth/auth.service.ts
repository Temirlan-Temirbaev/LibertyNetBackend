import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { UserService } from "../user/user.service"
import { CreateUserDto } from "../user/dto/create-user.dto"
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "./dto/login.dto"
import { User } from "../entities/user"

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async register(dto: CreateUserDto) {
    const { password } = dto
    const hashedPassword = await bcrypt.hash(password, 4)
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    })

    delete user.password
    return this.jwtService.sign({ ...user })
  }

  async login(dto: LoginDto) {
    const candidate = await this.userService.getUserByAddress(dto.address)
    if (!candidate) {
      throw new UnauthorizedException("User not found")
    }
    const isValidPassword = await bcrypt.compare(dto.password, candidate.password)
    if (!isValidPassword) {
      throw new HttpException("Not valid password", HttpStatus.BAD_REQUEST)
    }

    delete candidate.password

    return this.jwtService.sign({ ...candidate })
  }

  async edit(dto: Partial<CreateUserDto>, user: User) {
    const dbUser = await this.userService.getUserByAddress(user.address)
    if (!dbUser) {
      throw new UnauthorizedException("User not found")
    }
    Object.assign(dbUser, dto)
    return await this.userService.saveUser(dbUser)
  }

  async getUserByJwt(token: string) {
    if (!token.includes("Bearer")) {
      throw new UnauthorizedException({
        message: "User is not authorized",
      })
    }

    const user = await this.jwtService.verify(token.split(" ")[1])

    if (!user) {
      throw new UnauthorizedException({
        message: "User is not authorized",
      })
    }

    const dbUser = await this.userService.getUserByAddress(user.address)

    if (!dbUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    return dbUser
  }

  async getUserByAddress(address: string) {
    const user = await this.userService.getUserByAddress(address)
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }
    return user
  }
}
