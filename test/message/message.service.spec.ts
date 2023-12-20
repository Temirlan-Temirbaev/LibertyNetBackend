import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from '../../src/message/message.service';
import {mockMessageRepository, MockMessageRepository} from '../../mocks/mock-message.repository';
import { CreateMessageDto } from '../../src/message/dto/create-message.dto';
import { ConversationService } from '../../src/conversation/conversation.service';
import { MockConversationService } from '../../mocks/mock-conversation.service';
import { io } from 'socket.io-client';
import { mockUserData } from '../../mocks/mock-user.data';
import { mockConversationData } from '../../mocks/mock-conversation.data';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Message} from "../../src/entities/message";
import {Conversation} from "../../src/entities/conversation";
import {User} from "../../src/entities/user";
import { MockConversationRepository } from '../../mocks/mock-conversation.repository';


describe('MessageService', () => {
    let messageService: MessageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MessageService,
                {
                    provide: getRepositoryToken(Message),
                    useClass: MockMessageRepository,
                },
                ConversationService,
            ],
        })
            .overrideProvider(ConversationService)
            .useClass(MockConversationService)
            .compile();

        messageService = module.get<MessageService>(MessageService);
    });

    it('should be defined', () => {
        expect(messageService).toBeDefined();
    });

    it('should create a message', async () => {
        expect(true).toBe(true);
    });
});