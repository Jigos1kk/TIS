import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { BaseEntity } from '../entity/base.entity.js';

// Base repository providing standard TypeORM operations
export abstract class BaseRepository<T extends BaseEntity> {
  protected repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity as T);
  }

  async findOne(options: { where: FindOptionsWhere<T> }): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async softDelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async find(options?: { where: FindOptionsWhere<T> }): Promise<T[]> {
    return this.repository.find(options as any);
  }
}
