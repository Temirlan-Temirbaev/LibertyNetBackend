import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Conversation } from "./conversation"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Message {
  @ApiProperty({ example: "1" })
  @PrimaryGeneratedColumn()
  id: number
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  @Column({ unique: false })
  author: string
  @ApiProperty({ example: "testContent" })
  @Column({ unique: false })
  content: string
  @ApiProperty({ example: "1" })
  @ManyToOne(() => Conversation, conversation => conversation.messages)
  conversationId: number
}
