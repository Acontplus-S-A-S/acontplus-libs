import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CompositeUseCase } from '@acontplus-core';
import { User } from '../domain/user';
import { PaginationParams, FilterParams, PaginatedResult } from '@acontplus-core';

export interface UserManagementRequest {
  action: 'create' | 'update' | 'delete' | 'bulk-operations' | 'search' | 'get-all' | 'get-by-id';
  data?: any;
  pagination?: PaginationParams;
  filters?: FilterParams;
}

export interface UserManagementResponse {
  success: boolean;
  data?: any;
  message?: string;
  affectedUsers?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementUseCase extends CompositeUseCase<
  UserManagementRequest,
  UserManagementResponse
> {
  // Mock users for demo purposes
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

  protected executeInternal(request: UserManagementRequest): Observable<UserManagementResponse> {
    switch (request.action) {
      case 'create':
        return this.handleCreate(request.data);
      case 'update':
        return this.handleUpdate(request.data);
      case 'delete':
        return this.handleDelete(request.data);
      case 'bulk-operations':
        return this.handleBulkOperations(request.data);
      case 'search':
        return this.handleSearch(request.data);
      case 'get-all':
        return this.handleGetAll(request.pagination, request.filters);
      case 'get-by-id':
        return this.handleGetById(request.data);
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }
  }

  private handleCreate(userData: Omit<User, 'id'>): Observable<UserManagementResponse> {
    // Validation
    if (!userData.name || !userData.email) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'Name and email are required',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    // Check if email already exists
    if (this.users.some(u => u.email === userData.email)) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'Email already exists',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    const newUser: User = {
      ...userData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    return new Observable(observer => {
      observer.next({
        success: true,
        data: newUser,
        message: 'User created successfully',
        affectedUsers: 1,
      });
      observer.complete();
    });
  }

  private handleUpdate(updateData: {
    id: number;
    data: Partial<User>;
  }): Observable<UserManagementResponse> {
    const userIndex = this.users.findIndex(u => u.id === updateData.id);

    if (userIndex === -1) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'User not found',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    // Validation
    if (
      updateData.data.email &&
      this.users.some(u => u.email === updateData.data.email && u.id !== updateData.id)
    ) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'Email already exists',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData.data,
      updatedAt: new Date().toISOString(),
    };

    return new Observable(observer => {
      observer.next({
        success: true,
        data: this.users[userIndex],
        message: 'User updated successfully',
        affectedUsers: 1,
      });
      observer.complete();
    });
  }

  private handleDelete(deleteData: { id: number }): Observable<UserManagementResponse> {
    const userIndex = this.users.findIndex(u => u.id === deleteData.id);

    if (userIndex === -1) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'User not found',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    this.users.splice(userIndex, 1);

    return new Observable(observer => {
      observer.next({
        success: true,
        message: 'User deleted successfully',
        affectedUsers: 1,
      });
      observer.complete();
    });
  }

  private handleBulkOperations(bulkData: any): Observable<UserManagementResponse> {
    let affectedCount = 0;

    if (bulkData.activateUsers?.length) {
      bulkData.activateUsers.forEach((id: number) => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.isActive = true;
          user.updatedAt = new Date().toISOString();
          affectedCount++;
        }
      });
    }

    if (bulkData.deactivateUsers?.length) {
      bulkData.deactivateUsers.forEach((id: number) => {
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.isActive = false;
          user.updatedAt = new Date().toISOString();
          affectedCount++;
        }
      });
    }

    if (bulkData.deleteUsers?.length) {
      const originalLength = this.users.length;
      this.users = this.users.filter(u => !bulkData.deleteUsers.includes(u.id));
      affectedCount += originalLength - this.users.length;
    }

    return new Observable(observer => {
      observer.next({
        success: affectedCount > 0,
        message: `Bulk operations completed. ${affectedCount} users affected.`,
        affectedUsers: affectedCount,
      });
      observer.complete();
    });
  }

  private handleSearch(searchData: {
    query: string;
    pagination: PaginationParams;
  }): Observable<UserManagementResponse> {
    const query = searchData.query.toLowerCase();
    const filteredUsers = this.users.filter(
      user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    );

    const startIndex = (searchData.pagination.page - 1) * searchData.pagination.pageSize;
    const endIndex = startIndex + searchData.pagination.pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const result: PaginatedResult<User> = {
      items: paginatedUsers,
      totalCount: filteredUsers.length,
      pageNumber: searchData.pagination.page,
      pageSize: searchData.pagination.pageSize,
      hasNextPage:
        searchData.pagination.page <
        Math.ceil(filteredUsers.length / searchData.pagination.pageSize),
      hasPreviousPage: searchData.pagination.page > 1,
    };

    return new Observable(observer => {
      observer.next({
        success: true,
        data: result,
        message: `Found ${filteredUsers.length} users`,
        affectedUsers: filteredUsers.length,
      });
      observer.complete();
    });
  }

  private handleGetAll(
    pagination?: PaginationParams,
    filters?: FilterParams,
  ): Observable<UserManagementResponse> {
    let filteredUsers = [...this.users];

    if (filters) {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(
          user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm),
        );
      }

      if (filters.isActive !== undefined) {
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
      }

      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
    }

    if (pagination?.sortBy) {
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

    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const result: PaginatedResult<User> = {
      items: paginatedUsers,
      totalCount: filteredUsers.length,
      pageNumber: page,
      pageSize: pageSize,
      hasNextPage: page < Math.ceil(filteredUsers.length / pageSize),
      hasPreviousPage: page > 1,
    };

    return new Observable(observer => {
      observer.next({
        success: true,
        data: result,
        message: `Retrieved ${paginatedUsers.length} users`,
        affectedUsers: paginatedUsers.length,
      });
      observer.complete();
    });
  }

  private handleGetById(data: { id: number }): Observable<UserManagementResponse> {
    const user = this.users.find(u => u.id === data.id);

    if (!user) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'User not found',
          affectedUsers: 0,
        });
        observer.complete();
      });
    }

    return new Observable(observer => {
      observer.next({
        success: true,
        data: user,
        message: 'User retrieved successfully',
        affectedUsers: 1,
      });
      observer.complete();
    });
  }

  // Public methods for external use
  public getUsers(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<User>> {
    return this.execute({ action: 'get-all', pagination, filters }).pipe(
      map(response => response.data),
    );
  }

  public getUserById(id: number): Observable<User> {
    return this.execute({ action: 'get-by-id', data: { id } }).pipe(map(response => response.data));
  }

  public createUser(userData: Omit<User, 'id'>): Observable<User> {
    return this.execute({ action: 'create', data: userData }).pipe(map(response => response.data));
  }

  public updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.execute({ action: 'update', data: { id, data: userData } }).pipe(
      map(response => response.data),
    );
  }

  public deleteUser(id: number): Observable<boolean> {
    return this.execute({ action: 'delete', data: { id } }).pipe(map(response => response.success));
  }

  public searchUsers(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<User>> {
    return this.execute({ action: 'search', data: { query, pagination } }).pipe(
      map(response => response.data),
    );
  }

  public getActiveUsers(pagination: PaginationParams): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination, { isActive: true });
  }

  public getUsersByRole(
    role: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination, { role });
  }

  public getUsersByStatus(
    isActive: boolean,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<User>> {
    return this.getUsers(pagination, { isActive });
  }

  public getUserStats(): Observable<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
  }> {
    const total = this.users.length;
    const active = this.users.filter(u => u.isActive).length;
    const inactive = total - active;

    const byRole = this.users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return new Observable(observer => {
      observer.next({ total, active, inactive, byRole });
      observer.complete();
    });
  }

  public getRoles(): Observable<string[]> {
    const roles = [...new Set(this.users.map(u => u.role))];
    return new Observable(observer => {
      observer.next(roles);
      observer.complete();
    });
  }

  // Helper methods for testing
  public getTotalUsers(): number {
    return this.users.length;
  }

  public getActiveUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }

  public getInactiveUsersCount(): number {
    return this.users.filter(u => !u.isActive).length;
  }
}
