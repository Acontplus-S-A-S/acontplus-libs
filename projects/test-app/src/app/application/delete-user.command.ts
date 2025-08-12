import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseRepository, DeleteCommand, UseCaseResult } from '@acontplus-core';
import { User } from '../user';

export interface DeleteUserRequest {
  id: number;
}

export interface DeleteUserResult {
  success: boolean;
  message?: string;
  userId: number;
}

@Injectable()
export class DeleteUserCommand extends DeleteCommand {
  constructor(private userRepository: BaseRepository<User>) {
    super();
  }

  execute(request: DeleteUserRequest): Observable<DeleteUserResult> {
    return this.userRepository.delete(request.id).pipe(
      map(response => {
        // Handle different response scenarios
        if (this.hasDataInResponse(response)) {
          // If response has data (unlikely for delete, but possible)
          return {
            success: true,
            userId: request.id,
            message: this.extractMessageFromApiResponse(response) || 'User deleted successfully',
          };
        } else if (this.hasMessageInResponse(response)) {
          // If response has only a success message
          return {
            success: true,
            userId: request.id,
            message: this.extractMessageFromApiResponse(response),
          };
        } else {
          // Default success case
          return {
            success: true,
            userId: request.id,
            message: 'User deleted successfully',
          };
        }
      }),
      catchError(error => {
        return throwError(() => this.mapRepositoryError(error, request.id));
      }),
    );
  }

  private mapRepositoryError(error: any, userId: number): UseCaseResult<DeleteUserResult> {
    switch (error?.code) {
      case 'USER_NOT_FOUND':
        return this.createErrorResult('USER_NOT_FOUND', 'User not found', [
          {
            code: 'USER_NOT_FOUND',
            message: `User with ID ${userId} does not exist`,
            severity: 'error',
            category: 'not_found',
          },
        ]);

      case 'USER_HAS_DEPENDENCIES':
        return this.createErrorResult(
          'USER_HAS_DEPENDENCIES',
          'Cannot delete user with existing dependencies',
          [
            {
              code: 'USER_HAS_DEPENDENCIES',
              message: 'User has associated records that must be removed first',
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
