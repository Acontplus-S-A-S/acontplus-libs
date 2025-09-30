import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult as PaginatedResult, PaginationParams } from '@acontplus/core';
import { User } from '../domain';
import { MockUserService } from './mock-user.service';

@Injectable({
  providedIn: 'root',
})
export class UserRepository {
  protected entityName = 'users';
  protected baseUrl = '/api/users';

  constructor(private mockService: MockUserService) {}

  getAll(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.getUsers(pagination);
  }

  getById(id: number): Observable<User> {
    return this.mockService.getUserById(id);
  }

  search(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.searchUsers(query, pagination);
  }

  getActiveUsers(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.getActiveUsers(pagination);
  }

  getUsersByRole(role: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.mockService.getUsersByRole(role, pagination);
  }

  create(entity: Omit<User, 'id'>): Observable<User> {
    return this.mockService.createUser(entity);
  }

  update(id: number, entity: Partial<User>): Observable<User> {
    return this.mockService.updateUser(id, entity);
  }

  delete(id: number): Observable<boolean> {
    return this.mockService.deleteUser(id);
  }

  bulkCreate(users: Omit<User, 'id'>[]): Observable<User[]> {
    return new Observable(observer => {
      const createdUsers: User[] = [];
      let completed = 0;

      users.forEach(userData => {
        this.mockService.createUser(userData).subscribe({
          next: user => {
            createdUsers.push(user);
            completed++;
            if (completed === users.length) {
              observer.next(createdUsers);
              observer.complete();
            }
          },
          error: error => observer.error(error),
        });
      });
    });
  }

  bulkUpdate(updates: { id: number; data: Partial<User> }[]): Observable<User[]> {
    return new Observable(observer => {
      const updatedUsers: User[] = [];
      let completed = 0;

      updates.forEach(update => {
        this.mockService.updateUser(update.id, update.data).subscribe({
          next: user => {
            updatedUsers.push(user);
            completed++;
            if (completed === updates.length) {
              observer.next(updatedUsers);
              observer.complete();
            }
          },
          error: error => observer.error(error),
        });
      });
    });
  }

  bulkDelete(ids: number[]): Observable<boolean> {
    return this.mockService.bulkDeleteUsers(ids);
  }

  activateUser(id: number): Observable<User> {
    return this.mockService.updateUser(id, { isActive: true });
  }

  deactivateUser(id: number): Observable<User> {
    return this.mockService.updateUser(id, { isActive: false });
  }

  changeUserRole(id: number, role: string): Observable<User> {
    return this.mockService.updateUser(id, { role });
  }
}
