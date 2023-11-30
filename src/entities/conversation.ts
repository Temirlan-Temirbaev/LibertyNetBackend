import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user';
import { Message } from './message';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => User, (user) => user)
  users: User[];
  @OneToMany(() => Message, (message) => message.conversationId)
  messages: Message[];
}
