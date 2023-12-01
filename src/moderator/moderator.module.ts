import { Module } from "@nestjs/common"
import { ModeratorService } from "./moderator.service"
import { ModeratorController } from "./moderator.controller"
import { AuthModule } from "../auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../entities/user"

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [ModeratorController],
  providers: [ModeratorService],
})
export class ModeratorModule {}
