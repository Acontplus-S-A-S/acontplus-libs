import { BaseRepository, DeleteCommand, UseCaseResult } from '@acontplus-core';
import { User } from '../user';
import { Injectable } from '@angular/core';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DeleteUserCommand extends DeleteCommand {
  constructor(
    private userRepository: BaseRepository<User>,
    // private authService: AuthService,
    // private auditService: AuditService, // Domain service for audit logging
  ) {
    super();
  }

  execute(request: { id: number }): Observable<boolean> {
    return this.userRepository.getById(request.id).pipe(
      switchMap((user) => {
        // Check if user can be deleted (business rules)
        if (!this.canDeleteUser(user)) {
          throw this.createErrorResult(
            'USER_CANNOT_BE_DELETED',
            'This user cannot be deleted due to business constraints',
            [
              {
                code: 'USER_CANNOT_BE_DELETED',
                message: 'User has active dependencies',
                target: 'id',
                severity: 'error',
                category: 'business',
              },
            ],
          );
        }

        // Perform the deletion
        return this.userRepository.delete(request.id).pipe(
          tap((success) => {
            if (success) {
              // Log the deletion for audit purposes
              // this.auditService.logUserDeletion(
              //   user,
              //   this.authService.getCurrentUserId(),
              // );
            }
          }),
        );
      }),
      catchError((error) =>
        throwError(() => this.mapRepositoryError(error, request.id)),
      ),
    );
  }

  // protected async checkAuthorization(request: {
  //   id: number;
  // }): Promise<boolean> {
  //   // Check if user has delete permission
  //   const hasPermission = await this.authService.hasPermission('users.delete');
  //   if (!hasPermission) return false;
  //
  //   // Additional check: users can't delete themselves
  //   const currentUserId = this.authService.getCurrentUserId();
  //   if (currentUserId === request.id) return false;
  //
  //   // Additional check: only admin can delete admin users
  //   const targetUser = await this.userRepository
  //     .getById(request.id)
  //     .toPromise();
  //   const currentUserRole = this.authService.getCurrentUserRole();
  //
  //   if (targetUser?.role === 'admin' && currentUserRole !== 'admin') {
  //     return false;
  //   }
  //
  //   return true;
  // }

  private canDeleteUser(user: User): boolean {
    // Business rules for user deletion
    // Example: Can't delete users who created content, have active sessions, etc.

    // For demo purposes, let's say we can't delete admin users if they're the last admin
    if (user.role === 'admin') {
      // In real implementation, you'd check the count of admin users
      // This is just an example
      return true; // Simplified for demo
    }

    return true;
  }

  private mapRepositoryError(
    error: any,
    userId: number,
  ): UseCaseResult<boolean> {
    switch (error?.code) {
      case 'USER_NOT_FOUND':
      case 'ENTITY_NOT_FOUND':
        return this.createErrorResult(
          'USER_NOT_FOUND',
          'The user to delete was not found',
          [
            {
              code: 'USER_NOT_FOUND',
              message: `User with ID ${userId} does not exist`,
              target: 'id',
              severity: 'error',
              category: 'business',
            },
          ],
        );

      case 'USER_HAS_DEPENDENCIES':
        return this.createErrorResult(
          'USER_CANNOT_BE_DELETED',
          'Cannot delete user with existing dependencies',
          [
            {
              code: 'USER_HAS_DEPENDENCIES',
              message: 'User has active relationships that prevent deletion',
              target: 'id',
              severity: 'error',
              category: 'business',
            },
          ],
        );

      default:
        return this.createErrorResult(
          'USER_DELETION_FAILED',
          'Failed to delete user',
          error?.errors || [
            {
              code: 'USER_DELETION_FAILED',
              message: error?.message || 'Unknown error during user deletion',
              severity: 'error',
              category: 'infrastructure',
            },
          ],
        );
    }
  }
}
