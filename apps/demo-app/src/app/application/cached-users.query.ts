import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CachedQuery, FilterParams, PaginatedResult, PaginationParams } from '@acontplus-core';
import { UserManagementUseCase } from './user-management.use-case';
import { User } from '../domain/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CachedUsersQuery extends CachedQuery<
  { pagination: PaginationParams; filters?: FilterParams },
  PaginatedResult<User>
> {
  private userManagement = inject(UserManagementUseCase);

  private cache = new Map<string, { data: PaginatedResult<User>; timestamp: number }>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  protected executeInternal(request: {
    pagination: PaginationParams;
    filters?: FilterParams;
  }): Observable<PaginatedResult<User>> {
    const cacheKey = this.getCacheKey(request);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return of(cached.data);
    }

    return this.userManagement.getUsers(request.pagination, request.filters).pipe(
      map(result => {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
        return result;
      }),
    );
  }

  protected getCacheKey(request: { pagination: PaginationParams; filters?: FilterParams }): string {
    const filtersStr = request.filters ? JSON.stringify(request.filters) : '';
    return `users_${request.pagination.page}_${request.pagination.pageSize}_${request.pagination.sortBy || 'none'}_${request.pagination.sortDirection || 'none'}_${filtersStr}`;
  }

  protected getCacheDuration(): number {
    return 5 * 60 * 1000; // 5 minutes
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.getCacheDuration();
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}
