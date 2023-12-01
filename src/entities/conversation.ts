import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { User } from "./user"
import { Message } from "./message"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Conversation {
  @ApiProperty({ example: "1" })
  @PrimaryGeneratedColumn()
  id: number
  @OneToMany(() => User, user => user)
  users: User[]
  @OneToMany(() => Message, message => message.conversationId)
  messages: Message[]
}
