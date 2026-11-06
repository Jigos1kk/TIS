import { 
  Repository, 
  EntityTarget, 
  ObjectLiteral, 
  DeepPartial, 
  FindManyOptions, 
  FindOneOptions, 
  FindOptionsWhere 
} from "typeorm";
import { AppDataSource } from "../index.js";

export class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  // В конструкторе принимаем сам класс сущности (Entity)
  constructor(entity: EntityTarget<T>) {
    this.repo = AppDataSource.getRepository(entity);
  }

  /**
   * Поиск всех записей
   * @param options - опции TypeORM (relations, where, order, take, skip и т.д.)
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  /**
   * Поиск одной записи по ID
   */
  async findById(id: number | string, options?: FindOneOptions<T>): Promise<T | null> {
    return this.repo.findOne({
      where: { id: id } as unknown as FindOptionsWhere<T>,
      ...options,
    });
  }

  /**
   * Поиск одной записи по условию
   */
  async findOneBy(where: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T | null> {
    return this.repo.findOne({ where, ...options });
  }

  /**
   * Создание новой записи
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  /**
   * Обновление записи по ID
   * Возвращает обновленную сущность.
   */
  async update(id: number | string, data: T): Promise<T | null> {
    // Выполняем обновление
    await this.repo.update(id, data);
    // Возвращаем актуальную версию сущности из БД
    return this.findById(id); 
  }

  /**
   * Удаление записи по ID (Hard delete)
   * Возвращает true, если запись была удалена, иначе false.
   */
  async delete(id: number | string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Мягкое удаление (Soft delete). 
   * Работает только если в сущности есть колонка с декоратором @DeleteDateColumn.
   */
  async softDelete(id: number | string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Подсчет количества записей
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repo.countBy(where || {});
  }
}