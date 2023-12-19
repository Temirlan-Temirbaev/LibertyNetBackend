import {Controller, Post, Body, Req, UseGuards, Header} from "@nestjs/common"
import { MessageService } from "./message.service"
import { CreateMessageDto } from "./dto/create-message.dto"
import { User } from "../entities/user"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Message } from "../entities/message"

@ApiTags("Message")
@Controller("message")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @ApiOperation({ summary: "Create message" })
  @ApiOkResponse({ type: Message })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(@Body() dto: CreateMessageDto, @Req() req: { user: User, headers : {authorization : string} }) {
    return this.messageService.createMessage(dto, req)
  }
}
