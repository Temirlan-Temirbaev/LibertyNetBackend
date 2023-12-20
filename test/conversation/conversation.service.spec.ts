import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from '../../src/conversation/conversation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockUserService } from '../../mocks/mock-user.service';
import { MockMessageRepository } from '../../mocks/mock-message.repository';
import { mockedJwtService } from '../../mocks/mock-jwt.service';
import { MockConversationRepository } from '../../mocks/mock-conversation.repository';
import { Conversation } from '../../src/entities/conversation';
import { JwtService } from "@nestjs/jwt";
import {User} from "../../src/entities/user";
import {MockConversationService} from "../../mocks/mock-conversation.service";

jest.mock('../../src/auth/guards/jwt-auth.guard');

describe('ConversationService', () => {
    let service: ConversationService;
    let mockConversationRepository: MockConversationRepository;
    let mockUserService: MockUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(Conversation),
                    useClass: MockConversationRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserService,
                },
                MockMessageRepository,
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
                {
                    provide: ConversationService,
                    useClass: MockConversationService,
                },
            ],
        }).compile();

        service = module.get<ConversationService>(ConversationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

});