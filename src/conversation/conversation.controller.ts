import { Controller, Get, Post, Param, Query, Req, UseGuards } from "@nestjs/common"
import { ConversationService } from "./conversation.service"
import { Conversation } from "../entities/conversation"
import { User } from "../entities/user"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"

@ApiTags("Conversation")
@Controller("conversation")
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @ApiOperation({ summary: "Create a conversation with someone" })
  @ApiOkResponse({ type: Conversation })
  @Post()
  async createConversation(@Query() query: { addresses: string }) {
    return this.conversationService.createConversation(query.addresses)
  }

  @ApiOperation({ summary: "Get user's conversation" })
  @ApiOkResponse({ type: [Conversation] })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getConversationsForUser(@Req() req: { user: User }) {
    return this.conversationService.getConversationsForUser(req.user)
  }

  @Get(":conversationId")
  @ApiOperation({ summary: "Get conversation by ID" })
  @ApiOkResponse({ type: Conversation })
  @UseGuards(JwtAuthGuard)
  async getConversationById(
    @Param("conversationId") conversationId: number,
    @Req()
    req: {
      user: User
    },
  ): Promise<Conversation> {
    return this.conversationService.getConversationById(conversationId, req.user)
  }
}
