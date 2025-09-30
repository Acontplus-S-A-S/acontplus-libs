import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpRepository } from './base-http.repository';
import { Repository, RepositoryConfig, SearchableRepository } from './interfaces';
import { PagedResult, PaginationParams } from '@acontplus/core';

// Create an injection token for RepositoryConfig
export const REPOSITORY_CONFIG = new InjectionToken<RepositoryConfig>('REPOSITORY_CONFIG');

@Injectable()
export class GenericRepository<TEntity = any, TId extends string | number = number>
  extends BaseHttpRepository
  implements Repository<TEntity, TId>
{
  protected override config: RepositoryConfig;

  constructor() {
    const config = inject<RepositoryConfig>(REPOSITORY_CONFIG);

    super();
    this.config = config;
  }

  getById(id: TId): Observable<TEntity> {
    return this.get<TEntity>(id.toString());
  }

  getAll(pagination?: PaginationParams): Observable<PagedResult<TEntity>> {
    const params = this.buildParams(pagination);
    return this.get<PagedResult<TEntity>>('', params);
  }

  create(entity: Partial<TEntity>): Observable<TEntity> {
    return this.post<TEntity>('', entity);
  }

  update(id: TId, entity: Partial<TEntity>): Observable<TEntity> {
    return this.put<TEntity>(id.toString(), entity);
  }

  remove(id: TId): Observable<void> {
    return super.delete<void>(id.toString());
  }

  protected buildParams(pagination?: PaginationParams, filters?: Record<string, any>): any {
    const params: any = {};

    if (pagination) {
      params.pageIndex = pagination.pageIndex?.toString() || '1';
      params.pageSize = pagination.pageSize?.toString() || '20';
      if (pagination.sortBy) params.sortBy = pagination.sortBy;
      if (pagination.sortDirection) params.sortDirection = pagination.sortDirection;
    }

    if (filters) {
      Object.assign(params, filters);
    }

    return params;
  }
}

@Injectable()
export class SearchableGenericRepository<TEntity = any, TId extends string | number = number>
  extends GenericRepository<TEntity, TId>
  implements SearchableRepository<TEntity, TId>
{
  search(query: string, pagination: PaginationParams): Observable<PagedResult<TEntity>> {
    const searchFilters = { q: query };
    const params = this.buildParams(pagination, searchFilters);
    return this.get<PagedResult<TEntity>>('search', params);
  }
}
