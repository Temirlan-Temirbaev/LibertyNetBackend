import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {MockUserRepository} from "../../mocks/mock-user.repository";
import {IsBannedGuard} from "../../src/auth/guards/is-banned.guard";

describe('IsBannedGuard', () => {
    let guard: IsBannedGuard;
    let mockUserRepository: MockUserRepository;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IsBannedGuard,
                {
                    provide: JwtService,
                    useValue: {
                        verify: jest.fn().mockImplementation((token) => {
                            if (token === 'validToken') {
                                return { userId: 'someUserId', isBanned: false };
                            } else if (token === 'bannedToken') {
                                return { userId: 'someUserId', isBanned: true };
                            } else {
                                throw new Error('Invalid token');
                            }
                        }),
                    },
                },
                {
                    provide: MockUserRepository,
                    useClass: MockUserRepository,
                },
            ],
        }).compile();

        guard = module.get<IsBannedGuard>(IsBannedGuard);
        mockUserRepository = module.get<MockUserRepository>(MockUserRepository);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow access for a user without ban', async () => {
        const context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer validToken' },
                }),
            }),
        };

        const result = await guard.canActivate(context as any);
        expect(result).toBeTruthy();
    });

    it('should throw HttpException for a user with ban', async () => {
        const context = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: { authorization: 'Bearer bannedToken' },
                }),
            }),
        };

        mockUserRepository.findOneBy = jest.fn().mockReturnValueOnce(Promise.resolve({ isBanned: true }));

        await expect(() => guard.canActivate(context as any)).toThrow('You are banned!!!');
    });
});
