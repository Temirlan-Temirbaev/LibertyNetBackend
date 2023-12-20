import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import {JwtService} from "@nestjs/jwt";
import {mockedJwtService} from "../../mocks/mock-jwt.service";

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthGuard,
                {
                    provide: 'IS_PUBLIC_KEY',
                    useValue: jest.fn(),
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
            ],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });
});
