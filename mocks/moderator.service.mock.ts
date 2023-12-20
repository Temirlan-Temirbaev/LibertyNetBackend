import {ModeratorService} from "../src/moderator/moderator.service";
import {SwitchRoleDto} from "../src/moderator/dto/switch-role.dto";
import {User} from "../src/entities/user";

export const mockModeratorService = {
    switchRole: jest.fn((dto: SwitchRoleDto) => Promise.resolve(new User())),
    switchBanned: jest.fn((address: string) => Promise.resolve(new User())),
};

export const mockModeratorServiceProvider = {
    provide: ModeratorService,
    useValue: mockModeratorService,
};
