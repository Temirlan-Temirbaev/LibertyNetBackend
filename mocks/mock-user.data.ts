// mock-user.data.ts
import { User } from '../src/entities/user';

export const mockUserData: User[] = [
    {
        id: 1,
        address: '0x557612fAbFe26F97bD7f6b6C0c11C21413A7366E',
        nickname: 'foofie213',
        avatar: 'avatar.com',
        password: 'test12345',
        isBanned: false,
        role: 'admin',
        posts: [],
        conversations: [],
    },
];
