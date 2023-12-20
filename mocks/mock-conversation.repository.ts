import { DeepPartial, EntityRepository, Repository } from 'typeorm';
import { Conversation } from '../src/entities/conversation';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Conversation)
export class MockConversationRepository extends Repository<Conversation> {
    private conversations: Conversation[] = [];

    findOne: jest.Mock = jest.fn(async (condition: Partial<Conversation>) => {
        const conversation = this.conversations.find((conv) => this.matchCondition(conv, condition));
        if (!conversation) {
            throw new NotFoundException(`Conversation with id ${condition.id} not found.`);
        }
        return conversation;
    });

    save: jest.Mock = jest.fn(async (entityLike: DeepPartial<Conversation>) => {
        const conversation = new Conversation();
        Object.assign(conversation, entityLike);
        this.conversations.push(conversation);
        return conversation;
    });

    create: jest.Mock = jest.fn((entityLike: DeepPartial<Conversation>) => {
        const conversation = new Conversation();
        Object.assign(conversation, entityLike);
        this.conversations.push(conversation);
        return conversation;
    });

    private matchCondition(conversation: Conversation, condition: Partial<Conversation>): boolean {
        return Object.keys(condition).every((key) => conversation[key] === condition[key]);
    }
}
