import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Comment } from "../entities/comment"
import { Repository } from "typeorm"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { User } from "../entities/user"
import { PostService } from "../post/post.service"
import { EditCommentDto } from "./dto/edit-comment.dto"

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>, private postService: PostService) {}

  async createComment(dto: CreateCommentDto, user: User) {
    const post = await this.postService.getPostById(dto.postId)
    const comment = await this.commentRepository.create({
      author: user.address,
      content: dto.content,
      postId: post.id,
    })

    return await this.commentRepository.save(comment)
  }

  async deleteComment(id: number, user: User) {
    const comment = await this.commentRepository.findOne({
      where: { id, author: user.address },
    })

    return await this.commentRepository.delete(comment)
  }

  async editComment(dto: EditCommentDto, user: User) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: dto.id,
        author: user.address,
      },
    })

    Object.assign(comment, { ...dto })

    return await this.commentRepository.save(comment)
  }
}
