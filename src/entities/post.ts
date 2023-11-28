import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user';
import { Comment } from './comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: false })
  content: string;
  @Column({ unique: false })
  mediaContentUrl: string;
  @ManyToOne(() => User, (user) => user.posts)
  author: User;
  @OneToMany(() => Comment, (comment) => comment.postId)
  comments: Comment[];
}
