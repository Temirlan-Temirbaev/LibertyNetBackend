import { Module } from "@nestjs/common"
import { PostService } from "./post.service"
import { PostController } from "./post.controller"
import { AuthModule } from "../auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Post } from "../entities/post"

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
