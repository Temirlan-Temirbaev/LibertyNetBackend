import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Post } from "./post"
import { ApiProperty } from "@nestjs/swagger"
import { Conversation } from "./conversation"

@Entity()
export class User {
  @ApiProperty({ example: "1", description: "unique id" })
  @PrimaryGeneratedColumn()
  id: number
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E", description: "address of wallet" })
  @Column({ unique: true })
  address: string
  @ApiProperty({ example: "foofie213" })
  @Column({ unique: true })
  nickname: string
  @ApiProperty({ example: "avatar.com" })
  @Column({ unique: false })
  avatar: string
  @Column()
  @ApiProperty({ example: "test12345" })
  password: string
  @ApiProperty({ example: true })
  @Column({ default: false })
  isBanned: boolean
  @ApiProperty({ example: "admin" })
  @Column({ default: "user" })
  role: string
  @ApiProperty({ type: () => [Post] })
  @OneToMany(() => Post, post => post.author)
  posts: Post[]
  @ApiProperty({ type: () => [Conversation] })
  @ManyToMany(() => Conversation, conversation => conversation.users, {
    cascade: true,
  })
  @JoinTable()
  conversations: Conversation[]
}
