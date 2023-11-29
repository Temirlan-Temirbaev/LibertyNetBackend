import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../entities/user";
import {Repository} from "typeorm";
import {SwitchRoleDto} from "./dto/switch-role.dto";

@Injectable()
export class ModeratorService {

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async switchRole({address, role}: SwitchRoleDto) {
    const user = await this.userRepository.findOneBy({address});
    if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    user.role = role;
    return await this.userRepository.save(user);
  }

  async switchBanned(address: string) {
    const user = await this.userRepository.findOneBy({address});
    if (!user) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    user.isBanned = !user.isBanned;
    return await this.userRepository.save(user);
  }

}
