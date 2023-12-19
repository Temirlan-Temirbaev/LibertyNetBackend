import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {Repository} from "typeorm"
import {Message} from "src/entities/message"
import {User} from "../entities/user"
import {CreateMessageDto} from "./dto/create-message.dto"
import {ConversationService} from "../conversation/conversation.service"
import * as aes256 from "aes256"
import {io} from "socket.io-client"

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private conversationService: ConversationService,
  ) {
  }

  async createMessage(dto: CreateMessageDto, req: { user: User, headers: { authorization: string } }) {
    const conversation = await this.conversationService.getConversationById(dto.conversationId, req.user)

    const encryptedContent = this.encrypt(dto.content)
    const message = await this.messageRepository.create({
      author: req.user.address,
      content: encryptedContent,
      conversationId: conversation.id,
    })

    const savedMessage = await this.messageRepository.save(message)

    const socket = io("ws://localhost:3000", {
      query: {
        conversationId: conversation.id,
      },
      transports: ["websocket"],
      extraHeaders: {
        token: req.headers.authorization.split(" ")[0]
      }
    })

    console.log(socket)

    socket.emit("message", {
      ...message,
      content: aes256.decrypt("liberty-net-message", message.content),
    })


    return savedMessage
  }

  private encrypt(text: string): string {
    return aes256.encrypt("liberty-net-message", text)
  }
}
