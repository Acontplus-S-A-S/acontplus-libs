import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WriteOnlyRepository } from '@acontplus-core';
import { User } from '../domain/user';
import { MockUserService } from './mock-user.service';

@Injectable({
  providedIn: 'root',
})
export class WriteOnlyUserRepository extends WriteOnlyRepository<User> {
  protected entityName = 'users';
  protected baseUrl = '/api/users';

  constructor(private mockService: MockUserService) {
    super();
  }

  override create(entity: Omit<User, 'id'>): Observable<User> {
    return this.mockService.createUser(entity);
  }

  override update(id: number, entity: Partial<User>): Observable<User> {
    return this.mockService.updateUser(id, entity);
  }

  override delete(id: number): Observable<boolean> {
    return this.mockService.deleteUser(id);
  }

  // Additional write operations specific to users
  bulkCreate(users: Omit<User, 'id'>[]): Observable<User[]> {
    // For demo purposes, create users sequentially
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
    // For demo purposes, update users sequentially
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
