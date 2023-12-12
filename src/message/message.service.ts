import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Message } from "src/entities/message"
import { User } from "../entities/user"
import { CreateMessageDto } from "./dto/create-message.dto"
import { ConversationService } from "../conversation/conversation.service"
import * as aes256 from "aes256"
import {SocketGateway} from "../sockets/websocket.gateway";

@Injectable()
export class MessageService {
  constructor(
      @InjectRepository(Message)
      private messageRepository: Repository<Message>,
      private conversationService: ConversationService,
      private socketGateway: SocketGateway,
  ) {}

  async createMessage(dto: CreateMessageDto, user: User) {
    const conversation = await this.conversationService.getConversationById(dto.conversationId, user);

    const encryptedContent = this.encrypt(dto.content);
    const message = await this.messageRepository.create({
      author: user.address,
      content: encryptedContent,
      conversationId: conversation.id,
    });

    const savedMessage = await this.messageRepository.save(message);

    conversation.users.forEach(participant => {
      if (participant.id.toString() !== user.id.toString()) {
        this.socketGateway.sendPrivateMessage(participant.id.toString(), user.id.toString(), savedMessage);
      }
    });

    return savedMessage;
  }

  private encrypt(text: string): string {
    return aes256.encrypt("liberty-net-message", text);
  }
}
