import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import {ModeratorService} from "../../src/moderator/moderator.service";
import {User} from "../../src/entities/user";


const mockRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
};

describe('ModeratorService', () => {
    let service: ModeratorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ModeratorService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<ModeratorService>(ModeratorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('switchRole', () => {
        it('should switch user role', async () => {
            const user = new User(); // Создаем mock-пользователя
            user.address = '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E';
            user.role = 'oldRole';

            mockRepository.findOneBy.mockReturnValueOnce(user);
            mockRepository.save.mockReturnValueOnce(user);

            const result = await service.switchRole({
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                role: 'admin',
            });

            expect(result).toEqual(user);
            expect(mockRepository.findOneBy).toHaveBeenCalledWith({
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
            });
            expect(user.role).toEqual('admin');
            expect(mockRepository.save).toHaveBeenCalledWith(user);
        });

        it('should throw HttpException if user is not found', async () => {
            mockRepository.findOneBy.mockReturnValueOnce(undefined);

            await expect(
                service.switchRole({
                    address: 'nonexistentAddress',
                    role: 'admin',
                })
            ).rejects.toThrowError(new HttpException('User not found', HttpStatus.NOT_FOUND));
        });
    });

});
