import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Message } from "src/entities/message"
import * as crypto from "crypto"

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // async createMessage(author: string, content: string, conversationId: number) {
  //     const encryptedContent = this.encrypt(content);
  //     const message = this.messageRepository.create({
  //         author: author,
  //         content: encryptedContent,
  //         conversationId: conversationId,
  //     });
  //     return this.messageRepository.save(message);
  // }
  //
  // private encrypt(text: string): string {
  //     const cipher = crypto.createCipher('aes-256-cbc', 'liberty-net-message');
  //     let encrypted = cipher.update(text, 'utf8', 'hex');
  //     encrypted += cipher.final('hex');
  //     return encrypted;
  // }
  //
  // async getMessagesForConversation(conversationId: number): Promise<Message[]> {
  //     const conversation = await this.messageRepository.findOne(conversationId);
  //     if (!conversation) {
  //         throw new NotFoundException(`Conversation with id ${conversationId} not found.`);
  //     }
  //
  //     const messages = await this.messageRepository.find({
  //         where: { conversationId },
  //     });
  //
  //     if (!messages || messages.length === 0) {
  //         throw new NotFoundException('No messages found for the conversation.');
  //     }
  //
  //     return messages;
  // }
  //
  // private decrypt(text: string): string {
  //     const decipher = crypto.createDecipher('aes-256-cbc', 'liberty-net-message');
  //     let decrypted = decipher.update(text, 'hex', 'utf8');
  //     decrypted += decipher.final('utf8');
  //     return decrypted;
  // }
  //
  // async decryptMessage(messageId: number): Promise<Message> {
  //     const message = await this.messageRepository.findOne(messageId);
  //     if (!message) {
  //         throw new NotFoundException(`Message with id ${messageId} not found.`);
  //     }
  //
  //     return { ...message, content: this.decrypt(message.content) };
  // }
}
