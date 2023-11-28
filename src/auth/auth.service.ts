import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const { password } = dto;
    const hashedPassword = await bcrypt.hash(password, 4);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });
    return this.jwtService.sign({ ...user });
  }

  async login(dto: LoginDto) {
    const candidate = await this.userService.getUserByAddress(dto.address);

    if (!candidate) {
      throw new UnauthorizedException('User not found');
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      candidate.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Not valid password', HttpStatus.BAD_REQUEST);
    }

    return this.jwtService.sign({ ...candidate });
  }

  async getUserByJwt(token: string) {
    if (!token.includes('Bearer')) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      });
    }

    const user = await this.jwtService.verify(token.split(' ')[1]);

    if (!user) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      });
    }

    return user;
  }
}
