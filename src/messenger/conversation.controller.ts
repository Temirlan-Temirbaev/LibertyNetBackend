import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { User } from '../entities/user';
import { Conversation } from '../entities/conversation';

@Controller('conversation')
export class ConversationController {
    constructor(private conversationService: ConversationService) {}

    @Post()
    async createConversation(@Body() users: User[]): Promise<Conversation> {
        return this.conversationService.createConversation(users);
    }

    @Get(':userId')
    async getConversationsForUser(@Param('userId') userId: number): Promise<Conversation[]> {
        return this.conversationService.getConversationsForUser(userId);
    }

    @Get(':conversationId')
    async getConversationById(@Param('conversationId') conversationId: number): Promise<Conversation> {
        return this.conversationService.getConversationById(conversationId);
    }
}
