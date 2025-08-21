// src/application/interfaces/repository.ts
export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll<P>(params: P): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: ID): Promise<void>;
}
