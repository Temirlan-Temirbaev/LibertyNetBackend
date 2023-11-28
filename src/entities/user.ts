import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  address: string;
  @Column({ unique: true })
  nickname: string;
  @Column({ unique: false })
  avatar: string;
  @Column()
  password: string;
  @Column({ default: false })
  isBanned: boolean;
  @Column({ default: 'user' })
  role: string;
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
