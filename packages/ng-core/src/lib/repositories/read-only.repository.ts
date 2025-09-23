import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { BaseEntity, FilterParams, PagedResult, PaginationParams } from '@acontplus/core';

export abstract class ReadOnlyRepository<T extends BaseEntity> extends BaseRepository<T> {
  // Read-only operations - must implement these
  abstract override getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PagedResult<T>>;

  abstract override getById(id: number): Observable<T>;

  abstract override search(query: string, pagination: PaginationParams): Observable<PagedResult<T>>;

  // Override to prevent write operations
  override create(): never {
    throw new Error('Create operation not supported in read-only repository');
  }

  override update(): never {
    throw new Error('Update operation not supported in read-only repository');
  }

  override delete(): never {
    throw new Error('Delete operation not supported in read-only repository');
  }
}
