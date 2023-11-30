import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Post } from "../entities/post"
import { Like, Repository } from "typeorm"
import { CreatePostDto } from "./dto/create-post.dto"
import { User } from "../entities/user"
import { EditPostDto } from "./dto/edit-post.dto"

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async getPostsByAuthor(address: string) {
    const posts = await this.postRepository.findBy({ author: { address } })
    return posts
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOneBy({ id })
    if (!post) {
      throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    }
    return post
  }

  async getPostsByContent(content: string) {
    const posts = await this.postRepository.find({
      where: { content: Like(`%${content}%`) }, // Assuming 'content' is the name of the column in your Post entity
    })

    return posts
  }

  async getRecentPosts(page: number) {
    return await this.postRepository.find({
      skip: (page - 1) * 9,
      order: { id: "DESC" },
      take: 9,
    })
  }

  async createPost(dto: CreatePostDto, user: User) {
    const post = await this.postRepository.create({ ...dto, author: user })
    console.log(post)
    return await this.postRepository.save(post)
  }

  async editPost(dto: EditPostDto, user: User) {
    const post = await this.postRepository.findOne({
      where: { id: dto.id },
      relations: ["author"],
    })

    if (!(post.author.address === user.address)) {
      throw new HttpException("You have not access to this post", HttpStatus.NOT_ACCEPTABLE)
    }
    Object.assign(post, { ...dto })
    return await this.postRepository.save(post)
  }

  async deletePost(address: string, id: number) {
    const post = await this.postRepository.findOneBy({ id: id, author: { address } })
    if (!post) throw new HttpException("Post not found", HttpStatus.NOT_FOUND)
    return await this.postRepository.delete(post)
  }
}
