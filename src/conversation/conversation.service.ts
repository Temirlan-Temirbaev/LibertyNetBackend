import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Conversation } from "../entities/conversation"
import { UserService } from "../user/user.service"
import { User } from "../entities/user"
import * as aes256 from "aes256"

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    private userService: UserService,
  ) {}

  async createConversation(addresses: string) {
    try {
      if (addresses.split(",").length !== 2) {
        new BadRequestException("A conversation must have two users.")
      }
      const user1 = await this.userService.getUserByAddress(addresses.split(",")[0])
      const user2 = await this.userService.getUserByAddress(addresses.split(",")[1])
      if (!user1 || !user2) {
        new NotFoundException("One or more users do not exist.")
      }
      const conversation = this.conversationRepository.create({
        users: [user1, user2],
      })
      console.log(conversation)
      return this.conversationRepository.save(conversation)
    } catch (e) {
      console.log(e)
    }
  }

  async getConversationsForUser(jwtUser: User) {
    const user = await this.userService.getUserByAddress(jwtUser.address)
    if (!user) {
      throw new NotFoundException(`User with address ${jwtUser.address} not found.`)
    }

    const conversations = await this.conversationRepository.find({
      relations: ["users"],
    })

    const userConversations = conversations.filter(conversation => conversation.users.some(participant => participant.id === user.id))

    return userConversations
  }

  async getConversationById(conversationId: number, user: User) {
    const conversation = await this.conversationRepository.findOne({
      where: {
        id: conversationId,
      },
      relations: ["messages", "users"],
    })
    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${conversationId} not found.`)
    }

    const userIds = conversation.users.map(user => user.id)

    if (!userIds.includes(user.id)) {
      throw new HttpException("You don't have access to this conversation!", HttpStatus.METHOD_NOT_ALLOWED)
    }

    return {
      ...conversation,
      messages: conversation.messages.map(message => {
        return { ...message, content: this.decrypt(message.content) }
      }),
    }
  }

  private decrypt(text: string) {
    const decrypted = aes256.decrypt("liberty-net-message", text)
    return decrypted
  }
}
