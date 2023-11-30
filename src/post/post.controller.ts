import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common"
import { PostService } from "./post.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { IsBannedGuard } from "../auth/guards/is-banned.guard"
import { User } from "../entities/user"
import { EditPostDto } from "./dto/edit-post.dto"

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(":page")
  getRecentPosts(@Param("page") page: number) {
    return this.postService.getRecentPosts(page)
  }

  @Get("content/:content")
  getByContent(@Param("content") content: string) {
    return this.postService.getPostsByContent(content)
  }

  @Get("address/:address")
  getByAuthor(@Param("address") address: string) {
    return this.postService.getPostsByAuthor(address)
  }

  @Get("id/:id")
  getPostById(@Param("id") id: number) {
    return this.postService.getPostById(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  createPost(@Body() dto: CreatePostDto, @Req() request: { user: User }) {
    return this.postService.createPost(dto, request.user)
  }

  @Put()
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  editPost(@Req() request: { user: User }, @Body() dto: EditPostDto) {
    return this.postService.editPost(dto, request.user)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  deletePost(@Req() request: { user: User }, @Param("id") id: number) {
    return this.postService.deletePost(request.user.address, id)
  }
}
