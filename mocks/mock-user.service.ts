import { DeepPartial, Repository } from 'typeorm';
import { User } from '../src/entities/user';

export class MockUserService extends Repository<User> {
    private users: User[] = [];

    findOneBy(condition?: Partial<User>): Promise<User | undefined> {
        return Promise.resolve(this.users.find(user => this.matchCondition(user, condition || {})));
    }

    save: jest.Mock = jest.fn((entityLike: DeepPartial<User>) => {
        const user = this.create(entityLike) as User; // Приводим тип к User
        this.users.push(user);
        return Promise.resolve(user);
    });

    create: jest.Mock = jest.fn((entityLike: DeepPartial<User>) => {
        const user = new User();
        Object.assign(user, entityLike);
        return user;
    });

    private matchCondition(user: User, condition: Partial<User>): boolean {
        return Object.keys(condition).every(key => user[key] === condition[key]);
    }
}