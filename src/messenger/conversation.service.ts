import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Conversation } from "../entities/conversation"
import { User } from "../entities/user"

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // async createConversation(users: User[]): Promise<Conversation> {
  //     if (!users || users.length < 2) {
  //         throw new BadRequestException('A conversation must have at least two users.');
  //     }
  //
  //     const existingUsers = await this.userRepository.findByIds(users.map(user => user.id));
  //     if (existingUsers.length !== users.length) {
  //         throw new NotFoundException('One or more users do not exist.');
  //     }
  //
  //     const conversation = this.conversationRepository.create({ users });
  //     return this.conversationRepository.save(conversation);
  // }
  //
  // async getConversationsForUser(userId: number): Promise<Conversation[]> {
  //     const user = await this.userRepository.findOne(userId);
  //     if (!user) {
  //         throw new NotFoundException(`User with id ${userId} not found.`);
  //     }
  //
  //     return this.conversationRepository
  //         .createQueryBuilder('conversation')
  //         .innerJoin('conversation.users', 'user', 'user.id = :userId', { userId })
  //         .getMany();
  // }
  //
  // async getConversationById(conversationId: number): Promise<Conversation> {
  //     const conversation = await this.conversationRepository.findOne(conversationId);
  //     if (!conversation) {
  //         throw new NotFoundException(`Conversation with id ${conversationId} not found.`);
  //     }
  //
  //     return conversation;
  // }
}
