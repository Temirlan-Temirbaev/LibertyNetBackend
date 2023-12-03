import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Message } from "src/entities/message"
import { User } from "../entities/user"
import { CreateMessageDto } from "./dto/create-message.dto"
import { ConversationService } from "../conversation/conversation.service"
import * as aes256 from "aes256"

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private conversationService: ConversationService,
  ) {}

  async createMessage(dto: CreateMessageDto, user: User) {
    const conversation = await this.conversationService.getConversationById(dto.conversationId, user)

    const encryptedContent = this.encrypt(dto.content)
    const message = await this.messageRepository.create({
      author: user.address,
      content: encryptedContent,
      conversationId: conversation.id,
    })

    return this.messageRepository.save(message)
  }

  private encrypt(text: string): string {
    const encrypted = aes256.encrypt("liberty-net-message", text)
    return encrypted
  }
}
