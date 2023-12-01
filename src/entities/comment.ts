import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Post } from "./post"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Comment {
  @ApiProperty({ example: "1", description: "unique id" })
  @PrimaryGeneratedColumn()
  id: number
  @ApiProperty({ example: "0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E" })
  @Column({ unique: false })
  author: string
  @ApiProperty({ example: "testContent" })
  @Column({ unique: false })
  content: string
  @ApiProperty({ example: "1" })
  @ManyToOne(() => Post, post => post.comments)
  postId: number
}
