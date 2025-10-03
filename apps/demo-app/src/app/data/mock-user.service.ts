import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../domain/user';
import { PagedResult as PaginatedResult, PaginationParams } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class MockUserService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'manager',
      isActive: true,
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      role: 'user',
      isActive: false,
      createdAt: '2024-01-18T13:00:00Z',
      updatedAt: '2024-01-18T13:00:00Z',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      role: 'manager',
      isActive: true,
      createdAt: '2024-01-19T14:00:00Z',
      updatedAt: '2024-01-19T14:00:00Z',
    },
    {
      id: 6,
      name: 'Diana Davis',
      email: 'diana.davis@example.com',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-20T15:00:00Z',
      updatedAt: '2024-01-20T15:00:00Z',
    },
    {
      id: 7,
      name: 'Eve Miller',
      email: 'eve.miller@example.com',
      role: 'admin',
      isActive: true,
      createdAt: '2024-01-21T16:00:00Z',
      updatedAt: '2024-01-21T16:00:00Z',
    },
    {
      id: 8,
      name: 'Frank Garcia',
      email: 'frank.garcia@example.com',
      role: 'user',
      isActive: false,
      createdAt: '2024-01-22T17:00:00Z',
      updatedAt: '2024-01-22T17:00:00Z',
    },
    {
      id: 9,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      role: 'manager',
      isActive: true,
      createdAt: '2024-01-23T18:00:00Z',
      updatedAt: '2024-01-23T18:00:00Z',
    },
    {
      id: 10,
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      role: 'user',
      isActive: true,
      createdAt: '2024-01-24T19:00:00Z',
      updatedAt: '2024-01-24T19:00:00Z',
    },
  ];

  private nextId = 11;

  getUsers(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    const filteredUsers = [...this.users];

    // Apply sorting
    if (pagination.sortBy) {
      filteredUsers.sort((a, b) => {
        const aValue = (a as any)[pagination.sortBy!];
        const bValue = (b as any)[pagination.sortBy!];

        if (typeof aValue === 'string') {
          return pagination.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return pagination.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    // Apply pagination
    const startIndex = (pagination.pageIndex - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const result: PaginatedResult<User> = {
      items: paginatedUsers,
      totalCount: filteredUsers.length,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(filteredUsers.length / pagination.pageSize),
      hasPreviousPage: pagination.pageIndex > 1,
      hasNextPage: pagination.pageIndex < Math.ceil(filteredUsers.length / pagination.pageSize),
    };

    return of(result).pipe(delay(300)); // Simulate network delay
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return of(user).pipe(delay(200));
    }
    throw new Error('User not found');
  }

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    return of(this.users[userIndex]).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return of(false);
    }

    this.users.splice(userIndex, 1);
    return of(true).pipe(delay(300));
  }

  searchUsers(query: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination);
  }

  getActiveUsers(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination);
  }

  getUsersByRole(role: string, pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination);
  }

  // Bulk operations
  bulkActivateUsers(userIds: number[]): Observable<boolean[]> {
    const results = userIds.map(id => {
      const user = this.users.find(u => u.id === id);
      if (user) {
        user.isActive = true;
        user.updatedAt = new Date().toISOString();
        return true;
      }
      return false;
    });

    return of(results).pipe(delay(800));
  }

  bulkDeactivateUsers(userIds: number[]): Observable<boolean[]> {
    const results = userIds.map(id => {
      const user = this.users.find(u => u.id === id);
      if (user) {
        user.isActive = false;
        user.updatedAt = new Date().toISOString();
        return true;
      }
      return false;
    });

    return of(results).pipe(delay(800));
  }

  bulkDeleteUsers(userIds: number[]): Observable<boolean> {
    const originalLength = this.users.length;
    this.users = this.users.filter(u => !userIds.includes(u.id));
    const deleted = originalLength - this.users.length;

    return of(deleted > 0).pipe(delay(1000));
  }

  // Helper methods
  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  getInactiveUsersCount(): number {
    return this.users.filter(u => !u.isActive).length;
  }
}
