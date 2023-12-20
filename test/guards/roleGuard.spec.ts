import { Test, TestingModule } from '@nestjs/testing';
import { RoleGuard } from '../../src/auth/guards/role.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpStatus, HttpException } from '@nestjs/common';

describe('RoleGuard', () => {
    let guard: RoleGuard;
    let jwtService: JwtService;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleGuard,
                JwtService,
                Reflector,
            ],
        }).compile();

        guard = module.get<RoleGuard>(RoleGuard);
        jwtService = module.get<JwtService>(JwtService);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should allow access when user has the required role', () => {
        const context: ExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: 'Bearer validToken',
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any;

        jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'admin' });
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

        const result = guard.canActivate(context);

        expect(result).toBeTruthy();
    });

    it('should allow access when user has the required role', () => {
        const context: ExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: 'Bearer validToken',
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any;

        jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'admin' });
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

        const result = guard.canActivate(context);

        expect(result).toBeTruthy();
    });

    it('should throw HttpException when user does not have the required role', () => {
        const context: ExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: 'Bearer validToken',
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any;

        jest.spyOn(jwtService, 'verify').mockReturnValue({ role: 'user' });
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

        expect(() => guard.canActivate(context)).toThrowError(new HttpException('You have no rights', HttpStatus.METHOD_NOT_ALLOWED));
    });

    it('should allow access when requiredRole is null', () => {
        const context: ExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: 'Bearer validToken',
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

        const result = guard.canActivate(context);

        expect(result).toBeTruthy();
    });

    it('should allow access when requiredRole is undefined', () => {
        const context: ExecutionContext = {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: 'Bearer validToken',
                    },
                }),
            }),
            getHandler: jest.fn(),
            getClass: jest.fn(),
        } as any;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

        const result = guard.canActivate(context);

        expect(result).toBeTruthy();
    });
});
