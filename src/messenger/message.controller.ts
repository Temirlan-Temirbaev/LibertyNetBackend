import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Post(':conversationId')
    async createMessage(
        @Param('conversationId') conversationId: number,
        @Body() messageData: { author: string; content: string },
    ) {
        const { author, content } = messageData;
        return this.messageService.createMessage(author, content, conversationId);
    }

    @Get('conversation/:conversationId')
    async getMessagesForConversation(@Param('conversationId') conversationId: number) {
        return this.messageService.getMessagesForConversation(conversationId);
    }

    @Get(':messageId/decrypt')
    async decryptMessage(@Param('messageId') messageId: number) {
        return this.messageService.decryptMessage(messageId);
    }
}
