import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BaseRepository,
  FilterParams,
  PaginatedResult,
  PaginationParams,
} from '@acontplus-core';
import { User } from './user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserWebRepository extends BaseRepository<User> {
  constructor(private http: HttpClient) {
    super(http, '/api/users');
  }

  // Base CRUD Operations - now much simpler with standardized interceptor
  getAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<PaginatedResult<User>>(this.buildUrl(''), params);
  }

  getById(id: number): Observable<User> {
    return this.get<User>(this.buildUrl(id.toString()));
  }

  create(entity: Omit<User, 'id'>): Observable<User> {
    return this.post<User>(this.buildUrl(''), entity);
  }

  update(id: number, entity: Partial<User>): Observable<User> {
    return this.put<User>(this.buildUrl(id.toString()), entity);
  }

  delete(id: number): Observable<boolean> {
    return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
  }

  search(
    query: string,
    pagination: PaginationParams
  ): Observable<PaginatedResult<User>> {
    const params = {
      ...this.buildQueryParams(pagination),
      q: query,
    };
    return this.get<PaginatedResult<User>>(this.buildUrl('search'), params);
  }

  // User-specific operations
  getUserByEmail(email: string): Observable<User> {
    return this.get<User>(this.buildUrl(`by-email/${encodeURIComponent(email)}`));
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    return this.patch<User>(this.buildUrl(`${userId}/role`), { role });
  }

  activateUser(userId: number): Observable<boolean> {
    return this.patch<boolean>(this.buildUrl(`${userId}/activate`), {});
  }

  deactivateUser(userId: number): Observable<boolean> {
    return this.patch<boolean>(this.buildUrl(`${userId}/deactivate`), {});
  }

  bulkDelete(userIds: number[]): Observable<number> {
    return this.deleteHttp<{ deletedCount: number }>(this.buildUrl('bulk'), { body: { ids: userIds } }).pipe(
      map(response => response.deletedCount)
    );
  }

  bulkActivate(userIds: number[]): Observable<number> {
    return this.patch<{ activatedCount: number }>(this.buildUrl('bulk/activate'), { ids: userIds }).pipe(
      map(response => response.activatedCount)
    );
  }

  bulkDeactivate(userIds: number[]): Observable<number> {
    return this.patch<{ deactivatedCount: number }>(this.buildUrl('bulk/deactivate'), { ids: userIds }).pipe(
      map(response => response.deactivatedCount)
    );
  }

  importUsers(users: Omit<User, 'id'>[]): Observable<{ imported: number; errors: string[] }> {
    return this.post<{ imported: number; errors: string[] }>(this.buildUrl('import'), { users });
  }

  exportUsers(filters?: FilterParams): Observable<{ data: User[]; filename: string }> {
    const params = filters ? this.buildQueryParams({ page: 1, pageSize: 1000 }, filters) : {};
    return this.get<{ data: User[]; filename: string }>(this.buildUrl('export'), params);
  }

  // Helper method for bulk operations that need custom response handling
  private map<T>(response: any): T {
    // The interceptor already handles standardization, but we can add custom mapping if needed
    return response as T;
  }
}
