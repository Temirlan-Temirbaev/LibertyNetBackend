import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "../entities/user"
import { MessageController } from "./message.controller"
import { MessageService } from "./message.service"
import { Message } from "../entities/message"
import { ConversationModule } from "../conversation/conversation.module"
import { SocketGateway } from "../sockets/websocket.gateway"

@Module({
  imports: [AuthModule, ConversationModule, TypeOrmModule.forFeature([User, Message])],
  controllers: [MessageController],
  providers: [MessageService, SocketGateway],
  exports: [SocketGateway],
})
export class MessageModule {}
