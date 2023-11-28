import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Conversation } from './conversation';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: false })
  author: string;
  @Column({ unique: false })
  content: string;
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversationId: Conversation;
}
