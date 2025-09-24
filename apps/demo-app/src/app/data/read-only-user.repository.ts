import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ReadOnlyRepository,
  FilterParams,
  PaginatedResult,
  PaginationParams,
} from '@acontplus-core';
import { User } from '../domain/user';
import { MockUserService } from './mock-user.service';

@Injectable({
  providedIn: 'root',
})
export class ReadOnlyUserRepository extends ReadOnlyRepository<User> {
  protected entityName = 'users';
  protected baseUrl = '/api/users';

  constructor(private mockService: MockUserService) {
    super();
  }

  override getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<User>> {
    return this.mockService.getUsers(pagination, filters);
  }

  override getById(id: number): Observable<User> {
    return this.mockService.getUserById(id);
  }

  override search(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.searchUsers(query, pagination);
  }

  // Additional read-only operations specific to users
  getActiveUsers(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.getActiveUsers(pagination);
  }

  getUsersByRole(role: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.getUsersByRole(role, pagination);
  }
}
