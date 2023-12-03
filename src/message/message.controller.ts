import { Controller, Post, Body, Req, UseGuards } from "@nestjs/common"
import { MessageService } from "./message.service"
import { CreateMessageDto } from "./dto/create-message.dto"
import { User } from "../entities/user"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(@Body() dto: CreateMessageDto, @Req() req: { user: User }) {
    return this.messageService.createMessage(dto, req.user)
  }
}
