import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {ModeratorService} from "../../src/moderator/moderator.service";
import {mockModeratorService, mockModeratorServiceProvider} from "../../mocks/moderator.service.mock";
import {ModeratorController} from "../../src/moderator/moderator.controller";
import {mockedJwtService} from "../../mocks/mock-jwt.service";
import {MockJwtAuthGuard} from "../../mocks/mock-jwt-auth.guard";
import {User} from "../../src/entities/user";
import {MockUserRepository} from "../../mocks/mock-user.repository";
import {SwitchRoleDto} from "../../src/moderator/dto/switch-role.dto";


describe('ModeratorController', () => {
    let controller: ModeratorController;
    let service: ModeratorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ModeratorController],
            providers: [
                ModeratorService,
                mockModeratorServiceProvider,
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
                MockJwtAuthGuard,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
            ],
        }).compile();

        controller = module.get<ModeratorController>(ModeratorController);
        service = module.get<ModeratorService>(ModeratorService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('switchRole', () => {
        it('should switch user role', async () => {
            const user = new User();
            user.address = '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E';

            const dto: SwitchRoleDto = {
                address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
                role: 'admin',
            };

            mockModeratorService.switchRole.mockResolvedValueOnce(user);

            const result = await controller.switchRole(dto);

            expect(result).toEqual(user);
            expect(mockModeratorService.switchRole).toHaveBeenCalledWith(dto);
        });

        it('should throw HttpException if user is not found', async () => {
            const dto: SwitchRoleDto = {
                address: 'nonexistentAddress',
                role: 'admin',
            };

            mockModeratorService.switchRole.mockRejectedValueOnce(new HttpException('User not found', HttpStatus.NOT_FOUND));

            await expect(controller.switchRole(dto)).rejects.toThrowError(new HttpException('User not found', HttpStatus.NOT_FOUND));
            expect(mockModeratorService.switchRole).toHaveBeenCalledWith(dto);
        });
    });

});
