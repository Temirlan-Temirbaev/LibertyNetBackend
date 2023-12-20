import { EntityRepository, Repository } from 'typeorm';
import { Message } from '../src/entities/message';
import { CreateMessageDto } from '../src/message/dto/create-message.dto';
import {getRepositoryToken} from "@nestjs/typeorm";

@EntityRepository(Message)
export class MockMessageRepository extends Repository<Message> {
    private messages: Message[] = [];

    async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        const message = new Message();
        Object.assign(message, createMessageDto);

        this.messages.push(message);

        return Promise.resolve(message);
    }
}

export const mockMessageRepository = {
    provide: getRepositoryToken(Message),
    useClass: MockMessageRepository,
};
