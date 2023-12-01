import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { User } from "./user"
import { Comment } from "./comment"
import { ApiProperty } from "@nestjs/swagger"

@Entity()
export class Post {
  @ApiProperty({ example: "1", description: "unique id" })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: "Test Content" })
  @Column({ unique: false })
  content: string

  @ApiProperty({ example: "media.com" })
  @Column({ unique: false })
  mediaContentUrl: string

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.posts)
  author: User

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, comment => comment.postId)
  comments: Comment[]
}
