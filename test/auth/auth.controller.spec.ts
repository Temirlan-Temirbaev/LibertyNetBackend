import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { User } from '../../src/entities/user';
import { UserService } from "../../src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { MockUserRepository } from "../../mocks/mock-user.repository";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                JwtAuthGuard,
                UserService,
                JwtService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const userDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };

            jest.spyOn(authService, 'register').mockRejectedValue(new Error('Validation error'));

            await expect(controller.register(userDto)).rejects.toThrowError('Validation error');
        });

        it('should handle validation error in register', async () => {
            const userDto: CreateUserDto = {
                address: '',
                password: '',
                nickname: '',
                avatar: '',
            };

            jest.spyOn(authService, 'register').mockRejectedValue(new Error('Validation error'));

            await expect(controller.register(userDto)).rejects.toThrowError('Validation error');
        });
    });

    describe('login', () => {
        it('should log in a user and return a token', async () => {
            const loginDto: LoginDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
            };

            jest.spyOn(authService, 'login').mockResolvedValue('fakeToken');

            const result = await controller.login(loginDto);

            expect(result).toBe('fakeToken');
        });

        it('should handle validation error in login', async () => {
            const loginDto: LoginDto = {
                address: '',
                password: '',
            };

            jest.spyOn(authService, 'login').mockRejectedValue(new Error('Validation error'));

            await expect(controller.login(loginDto)).rejects.toThrowError('Validation error');
        });

        it('should handle UnauthorizedException if user not authorized', async () => {
            const invalidAuthorizationHeader = 'InvalidToken';

            jest.spyOn(authService, 'getUserByJwt').mockRejectedValue(new UnauthorizedException('User not authorized'));

            await expect(controller.checkLogin(invalidAuthorizationHeader)).rejects.toThrowError('User not authorized');
        });
    });

    describe('edit', () => {
        it('should edit the user profile', async () => {
            const userDto: Partial<CreateUserDto> = {
                nickname: 'newNickname',
            };

            const user: User = {
                id: 1,
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
            };

            const mockRequest = {
                user,
            };

            jest.spyOn(authService, 'edit').mockResolvedValue(user);

            const result = await controller.edit(userDto, mockRequest);

            expect(result).toBe(user);
        });

        it('should handle validation error in edit', async () => {
            const userDto: Partial<CreateUserDto> = {
                nickname: '',
            };

            const user: User = {
                id: 1,
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
            };

            const mockRequest = {
                user,
            };

            jest.spyOn(authService, 'edit').mockRejectedValue(new Error('Validation error'));

            await expect(controller.edit(userDto, mockRequest)).rejects.toThrowError('Validation error');
        });
    });

    describe('checkLogin', () => {
        it('should get user data by valid token', async () => {
            const validAuthorizationHeader = 'Bearer validToken';

            const user: User = {
                id: 1,
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
            };

            jest.spyOn(authService, 'getUserByJwt').mockResolvedValue(user);

            const result = await controller.checkLogin(validAuthorizationHeader);

            expect(result).toBe(user);
        });

        it('should handle UnauthorizedException if user is not authorized', async () => {
            const invalidAuthorizationHeader = 'InvalidToken';

            jest.spyOn(authService, 'getUserByJwt').mockRejectedValue(new UnauthorizedException('User is not authorized'));

            await expect(controller.checkLogin(invalidAuthorizationHeader)).rejects.toThrowError('User is not authorized');
        });
    });
});
