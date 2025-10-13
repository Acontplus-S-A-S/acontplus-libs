import { Observable } from 'rxjs';
import { PagedResult, PaginationParams } from '@acontplus/core';

export interface BaseRepository<TEntity = any, TId = number> {
  getById?(id: TId): Observable<TEntity>;
  getAll?(pagination?: PaginationParams): Observable<PagedResult<TEntity>>;
  create?(entity: Partial<TEntity>): Observable<TEntity>;
  update?(id: TId, entity: Partial<TEntity>): Observable<TEntity>;
  remove?(id: TId): Observable<void>;
}

export interface SearchableRepository<TEntity = any, TId = number>
  extends BaseRepository<TEntity, TId> {
  search?(query: string, pagination: PaginationParams): Observable<PagedResult<TEntity>>;
}
