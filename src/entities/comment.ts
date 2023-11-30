import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Post } from "./post"

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ unique: false })
  author: string
  @Column({ unique: false })
  content: string
  @ManyToOne(() => Post, post => post.comments)
  postId: number
}
