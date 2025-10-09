import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedResult, PaginationParams } from '@acontplus/core';
import { Repository, RepositoryConfig } from './interfaces';

@Injectable({ providedIn: 'root' })
export class RepositoryFactory {
  private http = inject(HttpClient);

  create<TEntity, TId extends string | number = number>(
    config: RepositoryConfig,
  ): Repository<TEntity, TId> {
    const buildUrl = (path = '') => {
      const baseUrl = config.baseUrl || '/api';
      const version = config.version ? `/v${config.version}` : '';
      const endpoint = path ? `${config.endpoint}/${path}` : config.endpoint;
      return `${baseUrl}${version}/${endpoint}`.replace(/\/+/g, '/');
    };

    const buildParams = (pagination?: PaginationParams) => {
      const params: any = {};
      if (pagination) {
        params.page = pagination.pageIndex?.toString() || '1';
        params.pageSize = pagination.pageSize?.toString() || '20';
        if (pagination.sortBy) params.sortBy = pagination.sortBy;
        if (pagination.sortDirection) params.sortDirection = pagination.sortDirection;
      }
      return params;
    };

    // Safe ID conversion function
    const idToString = (id: TId): string => {
      if (typeof id === 'string' || typeof id === 'number' || typeof id === 'bigint') {
        return id.toString();
      }
      // Fallback for other types - you might want to handle this differently
      return String(id);
    };

    return {
      getById: (id: TId) => this.http.get<TEntity>(buildUrl(idToString(id))),

      getAll: (pagination?) =>
        this.http.get<PagedResult<TEntity>>(buildUrl(), {
          params: buildParams(pagination),
        }),

      create: (entity: Partial<TEntity>) => this.http.post<TEntity>(buildUrl(), entity),

      update: (id: TId, entity: Partial<TEntity>) =>
        this.http.put<TEntity>(buildUrl(idToString(id)), entity),

      remove: (id: TId) => this.http.delete<void>(buildUrl(idToString(id))),
    };
  }
}
