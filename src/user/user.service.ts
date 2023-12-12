import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entities/user"
import { Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(dto: CreateUserDto) {
    const isUserWithSameNick = await this.userRepository.findOneBy({
      nickname: dto.nickname,
    })
    const isUserWithSameAddress = await this.userRepository.findOneBy({
      address: dto.address,
    })

    if (isUserWithSameAddress || isUserWithSameNick) {
      throw new HttpException("User with the same address or nickname is already has", HttpStatus.BAD_REQUEST)
    }

    const user = await this.userRepository.create({ ...dto, role: process.env.ROLE })

    return await this.userRepository.save(user)
  }

  async getUserByAddress(address: string) {
    return await this.userRepository.findOne({
      where: { address },
    })
  }

  async saveUser(user: User) {
    return await this.userRepository.save(user)
  }
}
