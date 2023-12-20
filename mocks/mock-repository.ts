import { Repository, EntityTarget } from 'typeorm';
import { getRepository } from 'typeorm';

export class MockRepository<T> {
    private repository: Repository<T>;
    private entities: T[] = [];

    constructor(entity: EntityTarget<T>) {
        this.repository = getRepository(entity);
    }

    async findOneById(id: number): Promise<T | undefined> {
        return this.entities.find((entity) => (entity as any).id === id);
    }

    async save(entity: T): Promise<T> {
        const newEntity = { ...(entity as any), id: this.entities.length + 1 };
        this.entities.push(newEntity);
        return newEntity;
    }

    async delete(criteria: string | number | Date | FindOptionsWhere<T>): Promise<void> {
        const id = typeof criteria === 'number' ? criteria : (criteria as FindOptionsWhere<T>).where?.id;
        if (id) {
            this.entities = this.entities.filter((entity) => (entity as any).id !== id);
        } else {
            throw new Error('Unsupported delete criteria');
        }
    }
}

interface FindOptionsWhere<T> {
    where?: { id: number };
}