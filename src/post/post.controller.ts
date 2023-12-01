import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common"
import { PostService } from "./post.service"
import { CreatePostDto } from "./dto/create-post.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { IsBannedGuard } from "../auth/guards/is-banned.guard"
import { User } from "../entities/user"
import { EditPostDto } from "./dto/edit-post.dto"
import { Post as PostSchema } from "../entities/post"
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

@ApiTags("Post")
@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: "Get posts by page" })
  @ApiOkResponse({ type: [PostSchema] })
  @Get(":page")
  getRecentPosts(@Param("page") page: number) {
    return this.postService.getRecentPosts(page)
  }

  @ApiOperation({ summary: "Get posts by content" })
  @ApiOkResponse({ type: [PostSchema] })
  @Get("content/:content")
  getByContent(@Param("content") content: string) {
    return this.postService.getPostsByContent(content)
  }

  @ApiOperation({ summary: "Get posts by address" })
  @ApiOkResponse({ type: [PostSchema] })
  @Get("address/:address")
  getByAuthor(@Param("address") address: string) {
    return this.postService.getPostsByAuthor(address)
  }

  @ApiOperation({ summary: "Get post by id" })
  @ApiResponse({ status: 200, type: PostSchema })
  @Get("id/:id")
  getPostById(@Param("id") id: number) {
    return this.postService.getPostById(id)
  }

  @ApiOperation({ summary: "Create Post" })
  @ApiResponse({ status: 200, type: PostSchema })
  @Post()
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  createPost(@Body() dto: CreatePostDto, @Req() request: { user: User }) {
    return this.postService.createPost(dto, request.user)
  }

  @ApiOperation({ summary: "Edit Post" })
  @ApiResponse({ status: 200, type: PostSchema })
  @Put()
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  editPost(@Req() request: { user: User }, @Body() dto: EditPostDto) {
    return this.postService.editPost(dto, request.user)
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete Post" })
  @UseGuards(JwtAuthGuard)
  deletePost(@Req() request: { user: User }, @Param("id") id: number) {
    return this.postService.deletePost(request.user.address, id)
  }
}
