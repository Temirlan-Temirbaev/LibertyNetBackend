import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConversationController } from "./conversation.controller"
import { ConversationService } from "./conversation.service"
import { Conversation } from "../entities/conversation"
import { UserModule } from "../user/user.module"

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([Conversation])],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
