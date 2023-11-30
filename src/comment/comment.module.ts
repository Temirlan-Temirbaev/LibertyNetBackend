import { Module } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { CommentController } from "./comment.controller"
import { AuthModule } from "../auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Comment } from "../entities/comment"
import { PostModule } from "../post/post.module"

@Module({
  imports: [AuthModule, PostModule, TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
