import { DeepPartial, Repository } from 'typeorm';
import { Comment } from '../src/entities/comment';

export class MockCommentRepository extends Repository<Comment> {
    private comments: Comment[] = [];

    async findOneBy(condition: Partial<Comment>): Promise<Comment | undefined> {
        const entries = Object.entries(condition);
        const comment = this.comments.find((comment) =>
            entries.every(([key, value]) => comment[key] === value),
        );
        return Promise.resolve(comment);
    }

    save: jest.Mock = jest.fn(async (entityLike: DeepPartial<Comment>) => {
        const comment = new Comment();
        Object.assign(comment, entityLike);
        this.comments.push(comment);
        return Promise.resolve(comment);
    });

    findOne: jest.Mock = jest.fn(async (id?: string | number | Date) => {
        if (id) {
            return Promise.resolve(this.comments.find((comment) => comment.id === id));
        }
        return Promise.resolve(undefined);
    });
}
