import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { User } from "./user"
import { Message } from "./message"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Conversation {
  @ApiProperty({ example: "1" })
  @PrimaryGeneratedColumn()
  id: number
  @ApiProperty({ type: () => [User], example: [User] })
  @ManyToMany(() => User, user => user.conversations)
  users: User[]
  @OneToMany(() => Message, message => message.conversationId, {
    cascade: true,
  })
  @ApiProperty({ type: [Message], example: [Message] })
  @JoinTable()
  messages: Message[]
}
