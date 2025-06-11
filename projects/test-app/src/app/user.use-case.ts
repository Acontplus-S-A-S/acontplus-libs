import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { UserRepository } from './user.repository';
import { User } from './user';
import {
  FilterParams,
  NotificationService,
  OperationResult,
  PaginatedResult,
  PaginationParams,
  ResponseMetadata,
} from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class UserUseCase {
  // State management
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private paginationSubject = new BehaviorSubject<ResponseMetadata>({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Public observables
  public readonly users$ = this.usersSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();
  public readonly pagination$ = this.paginationSubject.asObservable();

  constructor(
    private userRepository: UserRepository, // Inject the abstract class
    private notificationService: NotificationService
  ) {}

  // ========== USE CASE METHODS ==========

  loadUsers(
    pagination: PaginationParams = { page: 1, pageSize: 10 },
    filters?: FilterParams
  ): void {
    this.setLoading(true);
    this.clearError();

    this.userRepository.getAll(pagination, filters).subscribe({
      next: (result) => this.handleUsersLoaded(result),
      error: (error) => this.handleError(error),
      complete: () => this.setLoading(false),
    });
  }

  getUserById(id: number): Observable<User | null> {
    return this.userRepository.getById(id).pipe(
      map((result) => {
        if (result.success) {
          return result.data;
        } else {
          this.notificationService.showWarning(result.message);
          return null;
        }
      })
    );
  }

  createUser(userData: Omit<User, 'id'>): Observable<boolean> {
    // Business validation
    const validationError = this.validateUserData(userData);
    if (validationError) {
      this.notificationService.showError(validationError);
      return of(false);
    }

    return this.userRepository.create(userData).pipe(
      map((result) => {
        if (result.success && result.data) {
          this.addUserToLocalState(result.data);
          this.notificationService.showSuccess(result.message);
          return true;
        } else {
          this.showErrors(result);
          return false;
        }
      })
    );
  }

  updateUser(id: number, userData: Partial<User>): Observable<boolean> {
    return this.userRepository.update(id, userData).pipe(
      map((result) => {
        if (result.success && result.data) {
          this.updateUserInLocalState(result.data);
          this.notificationService.showSuccess(result.message);
          return true;
        } else {
          this.showErrors(result);
          return false;
        }
      })
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.userRepository.delete(id).pipe(
      map((result) => {
        if (result.success) {
          this.removeUserFromLocalState(id);
          this.notificationService.showSuccess(result.message);
        } else {
          this.notificationService.showError(result.message);
        }
        return result.success;
      })
    );
  }

  searchUsers(
    query: string,
    pagination: PaginationParams = { page: 1, pageSize: 10 }
  ): Observable<User[]> {
    if (!query || query.trim().length < 2) {
      return of([]);
    }

    return this.userRepository.search(query.trim(), pagination).pipe(
      map((result) => {
        if (result.success && result.data) {
          if (result.data.items.length === 0) {
            this.notificationService.showInfo(`No users found for "${query}"`);
          }
          return result.data.items;
        } else {
          this.notificationService.showError(result.message);
          return [];
        }
      })
    );
  }

  // Business-specific operations
  promoteUserToAdmin(userId: number): Observable<boolean> {
    return this.userRepository.updateUserRole(userId, 'admin').pipe(
      map((result) => {
        if (result.success) {
          this.notificationService.showSuccess(
            'User promoted to admin successfully'
          );
          this.updateUserInLocalState(result.data!);
          return true;
        } else {
          this.notificationService.showError(result.message);
          return false;
        }
      })
    );
  }

  toggleUserStatus(userId: number, activate: boolean): Observable<boolean> {
    const operation = activate
      ? this.userRepository.activateUser(userId)
      : this.userRepository.deactivateUser(userId);

    return operation.pipe(
      map((result) => {
        if (result.success) {
          const action = activate ? 'activated' : 'deactivated';
          this.notificationService.showSuccess(`User ${action} successfully`);
          // Refresh the users list to get updated status
          this.refreshCurrentPage();
          return true;
        } else {
          this.notificationService.showError(result.message);
          return false;
        }
      })
    );
  }

  bulkDeleteUsers(userIds: number[]): Observable<number> {
    if (userIds.length === 0) {
      this.notificationService.showWarning('No users selected');
      return of(0);
    }

    return this.userRepository.bulkDelete(userIds).pipe(
      map((result) => {
        if (result.success) {
          userIds.forEach((id) => this.removeUserFromLocalState(id));
          this.notificationService.showSuccess(
            `${result.data} users deleted successfully`
          );
          return result.data || 0;
        } else {
          this.notificationService.showError(result.message);
          return 0;
        }
      })
    );
  }

  // ========== PRIVATE HELPER METHODS ==========

  private validateUserData(userData: Omit<User, 'id'>): string | null {
    if (!userData.name || userData.name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }

    if (!userData.email || !this.isValidEmail(userData.email)) {
      return 'Please provide a valid email address';
    }

    if (!userData.role) {
      return 'User role is required';
    }

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleUsersLoaded(
    result: OperationResult<PaginatedResult<User>>
  ): void {
    if (result.success && result.data) {
      this.usersSubject.next(result.data.items);
      this.updatePagination(result.data);

      if (result.data.items.length === 0) {
        this.notificationService.showInfo('No users found');
      }
    } else {
      this.handleError(result);
    }
  }

  private updatePagination(data: PaginatedResult<User>): void {
    this.paginationSubject.next({
      totalCount: data.totalCount,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      hasNextPage: data.hasNextPage,
      hasPreviousPage: data.hasPreviousPage,
    });
  }

  private addUserToLocalState(user: User): void {
    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, user]);

    // Update pagination
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({
      ...currentPagination,
      totalCount: currentPagination.totalCount + 1,
    });
  }

  private updateUserInLocalState(updatedUser: User): void {
    const currentUsers = this.usersSubject.value;
    const updatedUsers = currentUsers.map((user) =>
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    );
    this.usersSubject.next(updatedUsers);
  }

  private removeUserFromLocalState(userId: number): void {
    const currentUsers = this.usersSubject.value;
    const filteredUsers = currentUsers.filter((user) => user.id !== userId);
    this.usersSubject.next(filteredUsers);

    // Update pagination
    const currentPagination = this.paginationSubject.value;
    this.paginationSubject.next({
      ...currentPagination,
      totalCount: Math.max(0, currentPagination.totalCount - 1),
    });
  }

  private refreshCurrentPage(): void {
    const currentPagination = this.paginationSubject.value;
    this.loadUsers({
      page: currentPagination.pageNumber,
      pageSize: currentPagination.pageSize,
    });
  }

  private handleError(result: OperationResult<any>): void {
    this.errorSubject.next(result.message);
    this.usersSubject.next([]);
    this.showErrors(result);
  }

  private showErrors(result: OperationResult<any>): void {
    this.notificationService.showError(result.message);

    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((error) =>
        this.notificationService.showError(error)
      );
    }
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }
}
