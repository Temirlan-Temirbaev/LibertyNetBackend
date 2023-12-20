import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from '../../src/message/message.controller';
import { MessageService } from '../../src/message/message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockMessageRepository } from '../../mocks/mock-message.repository';
import { ConversationService } from '../../src/conversation/conversation.service';
import { MockConversationService } from '../../mocks/mock-conversation.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { mockedJwtService } from '../../mocks/mock-jwt.service';
import { JwtService } from "@nestjs/jwt";
import { Message } from "../../src/entities/message";
import { ConversationController } from '../../src/conversation/conversation.controller';

jest.mock('../../src/auth/guards/jwt-auth.guard');

describe('ConversationController', () => {
    let controller: ConversationController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConversationController],
            providers: [
                MessageService,
                {
                    provide: getRepositoryToken(Message),
                    useClass: MockMessageRepository,
                },
                ConversationService,
                {
                    provide: ConversationService,
                    useClass: MockConversationService,
                },
                JwtAuthGuard,
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
            ],
        }).compile();

        controller = module.get<ConversationController>(ConversationController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
