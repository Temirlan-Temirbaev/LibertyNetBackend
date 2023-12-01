import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { IsBannedGuard } from "../auth/guards/is-banned.guard"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { User } from "../entities/user"
import { EditCommentDto } from "./dto/edit-comment.dto"
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Comment } from "../entities/comment"

@ApiTags("Comment")
@Controller("comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: "Comment" })
  @ApiResponse({ status: 200, type: Comment })
  @Post()
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  createComment(@Body() dto: CreateCommentDto, @Req() request: { user: User }) {
    return this.commentService.createComment(dto, request.user)
  }

  @Put()
  @ApiOperation({ summary: "Edit comment" })
  @ApiResponse({ status: 200, type: Comment })
  @UseGuards(JwtAuthGuard, IsBannedGuard)
  editComment(@Body() dto: EditCommentDto, @Req() request: { user: User }) {
    return this.commentService.editComment(dto, request.user)
  }

  @ApiOperation({ summary: "Delete comment" })
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param("id") id: number, @Req() request: { user: User }) {
    return this.commentService.deleteComment(id, request.user)
  }
}
