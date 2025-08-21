import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { BaseEntity } from '../models';

export abstract class WriteOnlyRepository<T extends BaseEntity> extends BaseRepository<T> {
  // Write operations - must implement these
  abstract override create(entity: Omit<T, 'id'>): Observable<T>;

  abstract override update(id: number, entity: Partial<T>): Observable<T>;

  abstract override delete(id: number): Observable<boolean>;

  // Override to prevent read operations
  override getAll(): never {
    throw new Error('Read operations not supported in write-only repository');
  }

  override getById(): never {
    throw new Error('Read operations not supported in write-only repository');
  }

  override search(): never {
    throw new Error('Read operations not supported in write-only repository');
  }
}
