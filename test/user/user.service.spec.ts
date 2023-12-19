import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/entities/user';
import { MockUserRepository } from "../../mocks/mock-user.repository";

describe('UserService', () => {
    let service: UserService;
    let repository: MockUserRepository;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
                Repository,
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<MockUserRepository>(getRepositoryToken(User));
        userRepository = module.get<Repository<User>>(Repository);
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

            const result = await service.createUser(createUserDto);

            expect(result).toBeDefined();
            expect(result.address).toEqual(createUserDto.address);
            expect(result.nickname).toEqual(createUserDto.nickname);
            expect(result.avatar).toEqual(createUserDto.avatar);
        });

        it('should handle error during user creation', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };
            const error = new Error('User creation error');

            jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(error);

            await expect(service.createUser(createUserDto)).rejects.toThrowError(error);
        });

        it('should handle duplicate nickname during user creation', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(new User());

            // Используем expect.any для уточнения типа ошибки
            await expect(service.createUser(createUserDto)).rejects.toThrowError(
                expect.any(HttpException)
            );
        });

        it('should handle duplicate address during user creation', async () => {
            const createUserDto: CreateUserDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                password: 'test12345',
                nickname: 'foofie213',
                avatar: 'avatar.com',
            };

            jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null).mockResolvedValueOnce(new User());

            // Используем expect.any для уточнения типа ошибки
            await expect(service.createUser(createUserDto)).rejects.toThrowError(
                expect.any(HttpException)
            );
        });
    });
});
