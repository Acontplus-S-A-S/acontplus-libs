import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, FilterParams, PaginatedResult, PaginationParams } from '@acontplus-core';
import { User } from '../domain/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserHttpRepository extends BaseRepository<User> {
  protected entityName = 'users';
  protected baseUrl = '/api/users';

  constructor() {
    super();
  }

  // Base CRUD Operations - now much simpler with standardized interceptor
  getAll(pagination: PaginationParams, filters?: FilterParams): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<PaginatedResult<User>>(this.buildUrl(''), params);
  }

  getById(id: number): Observable<User> {
    return this.get<User>(this.buildUrl(id.toString()));
  }

  create(user: Omit<User, 'id'>): Observable<User> {
    return this.post<User>(this.buildUrl(''), user);
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.put<User>(this.buildUrl(id.toString()), user);
  }

  delete(id: number): Observable<boolean> {
    return this.deleteHttp<boolean>(this.buildUrl(id.toString()));
  }

  // Custom business logic methods
  findByEmail(email: string): Observable<User | null> {
    return this.get<User[]>(this.buildUrl(''), { email }).pipe(
      map(users => (users.length > 0 ? users[0] : null)),
    );
  }

  findByUsername(username: string): Observable<User | null> {
    return this.get<User[]>(this.buildUrl(''), { username }).pipe(
      map(users => (users.length > 0 ? users[0] : null)),
    );
  }

  // Bulk operations
  createMany(users: Omit<User, 'id'>[]): Observable<User[]> {
    return this.post<User[]>(this.buildUrl('bulk'), users);
  }

  updateMany(users: Partial<User>[]): Observable<User[]> {
    return this.put<User[]>(this.buildUrl('bulk'), users);
  }

  deleteMany(ids: number[]): Observable<boolean> {
    return this.deleteHttp<boolean>(this.buildUrl('bulk'));
  }

  // Search and filtering
  search(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, { search: query });
    return this.get<PaginatedResult<User>>(this.buildUrl('search'), params);
  }
}
