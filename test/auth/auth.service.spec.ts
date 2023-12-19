import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { User } from '../../src/entities/user';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        createUser: jest.fn(),
                        getUserByAddress: jest.fn(),
                        saveUser: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('register', () => {
        it('should register a new user and return a token', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };
            const hashedPassword = 'hashedPassword';
            const signedToken = 'fakeToken';
            const user: User = {
                id: 1,
                address: createUserDto.address,
                password: hashedPassword,
                nickname: createUserDto.nickname,
                avatar: createUserDto.avatar,
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
            };

            jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
            jest.spyOn(userService, 'createUser').mockResolvedValue(user);
            jest.spyOn(jwtService, 'sign').mockReturnValue(signedToken);

            const result = await service.register(createUserDto);

            expect(result).toBe(signedToken);
            expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 4);
            expect(userService.createUser).toHaveBeenCalledWith({ ...createUserDto, password: hashedPassword });
            expect(jwtService.sign).toHaveBeenCalledWith({ ...user, password: undefined });
        });

        it('should handle error during user registration', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };
            const error = new Error('Registration error');

            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
            jest.spyOn(userService, 'createUser').mockRejectedValue(error);

            await expect(service.register(createUserDto)).rejects.toThrowError(error);
        });

    });

    describe('edit', () => {
        it('should edit the user profile', async () => {
            const userDto: Partial<CreateUserDto> = {
                nickname: 'newNickname',
            };
            const dbUser: User = {
                id: 1,
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password:'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
                isBanned: false,
                role: 'user',
                posts: [],
                conversations: [],
            };
            jest.spyOn(userService, 'getUserByAddress').mockResolvedValue(dbUser);
            jest.spyOn(userService, 'saveUser').mockResolvedValue(dbUser);

            const result = await service.edit(userDto, dbUser);

            expect(result).toBe(dbUser);
            expect(userService.getUserByAddress).toHaveBeenCalledWith(dbUser.address);
            expect(userService.saveUser).toHaveBeenCalledWith({ ...dbUser, ...userDto });
        });

        it('should handle error during user edit', async () => {
            const userDto: Partial<CreateUserDto> = {
                nickname: 'newNickname',
            };
            const dbUser: User = {
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
            const error = new Error('Edit error');

            jest.spyOn(userService, 'getUserByAddress').mockResolvedValue(dbUser);
            jest.spyOn(userService, 'saveUser').mockRejectedValue(error);

            await expect(service.edit(userDto, dbUser)).rejects.toThrowError(error);
        });

    });

    describe('getUserByJwt', () => {
        it('should get user data by valid token', async () => {
            const validToken = 'Bearer validToken';
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

            jest.spyOn(jwtService, 'verify').mockResolvedValue(user as never);
            jest.spyOn(userService, 'getUserByAddress').mockResolvedValue(user);

            const result = await service.getUserByJwt(validToken);

            expect(result).toBe(user);
            expect(jwtService.verify).toHaveBeenCalledWith('validToken');
            expect(userService.getUserByAddress).toHaveBeenCalledWith(user.address);
        });

        it('should handle UnauthorizedException if user is not authorized', async () => {
            const invalidToken = 'InvalidToken';

            jest.spyOn(jwtService, 'verify').mockResolvedValue(null as never);

            await expect(service.getUserByJwt(invalidToken)).rejects.toThrowError(UnauthorizedException);
        });

        it('should handle case when user not found in the database', async () => {
            const validToken = 'Bearer validToken';
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

            jest.spyOn(jwtService, 'verify').mockResolvedValue(user as never);
            jest.spyOn(userService, 'getUserByAddress').mockResolvedValue(null);

            await expect(service.getUserByJwt(validToken)).rejects.toThrowError(HttpException);
        });

        it('should handle error during user retrieval by JWT', async () => {
            const validToken = 'Bearer validToken';
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
            const error = new Error('User retrieval error');

            jest.spyOn(jwtService, 'verify').mockResolvedValue(user as never);
            jest.spyOn(userService, 'getUserByAddress').mockRejectedValue(error);

            await expect(service.getUserByJwt(validToken)).rejects.toThrowError(error);
        });

    });
});

