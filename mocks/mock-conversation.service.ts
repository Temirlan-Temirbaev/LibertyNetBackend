import { Injectable } from '@nestjs/common';
import { Conversation } from '../src/entities/conversation';
import { User } from '../src/entities/user';

@Injectable()
export class MockConversationService {
    private conversations: Conversation[] = [];
    private users: User[] = [];

    async getConversationById(id: number, user: User): Promise<Conversation> {
        const conversation = this.conversations.find((conv) => conv.id === id);

        if (!conversation || !conversation.users.find((u) => u.id === user.id)) {
            throw new Error('Conversation not found or user not authorized');
        }

        return conversation;
    }

    createConversation(id: number, users: User[]): Conversation {
        const conversation: Conversation = {
            id,
            users,
            messages: [],
        };
        this.conversations.push(conversation);
        return conversation;
    }

    addUser(user: User): void {
        this.users.push(user);
    }


    getUsers(): User[] {
        return this.users;
    }
}
