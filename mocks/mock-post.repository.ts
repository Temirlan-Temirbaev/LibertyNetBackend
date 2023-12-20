import { DeepPartial, DeleteResult, ObjectId, Repository } from 'typeorm';

export class MockPostRepository extends Repository<DeepPartial<any>> {
    private posts: DeepPartial<any>[] = [];

    async findOneById(id: number): Promise<DeepPartial<any> | undefined> {
        return this.posts.find((post) => post.id === id);
    }

    async save(post: DeepPartial<any>): Promise<DeepPartial<any>> {
        const newPost = Object.assign({ id: this.posts.length + 1 }, post) as DeepPartial<any>;
        this.posts.push(newPost);
        return newPost;
    }

    async delete(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<DeepPartial<any>>): Promise<DeleteResult> {
        const id = typeof criteria === 'number' ? criteria : (criteria as FindOptionsWhere<DeepPartial<any>>).where?.id;
        if (id) {
            this.posts = this.posts.filter((post) => post.id !== id);
            return new DeleteResult();
        } else {
            throw new Error('Unsupported delete criteria');
        }
    }

}

interface FindOptionsWhere<T> {
    where?: T;
}

interface FindOptionsWhere<T> {
    condition?: T;
}
