// Get Users Query with business logic
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  BaseRepository,
  FilterParams,
  GetAllQuery,
  PaginatedResult,
  UseCaseResult,
} from '@acontplus-core';
import { User } from '../user';
import { PaginationParams } from '@acontplus-core';

@Injectable()
export class GetUsersQuery extends GetAllQuery<User> {
  constructor(
    private userRepository: BaseRepository<User>,
    // private authService: AuthService,
  ) {
    super();
  }

  execute(request: {
    pagination: PaginationParams;
    filters?: FilterParams;
  }): Observable<PaginatedResult<User>> {
    return this.userRepository.getAll(request.pagination, request.filters).pipe(
      map((result) => {
        // Apply business rules - e.g., filter sensitive data based on user role
        // const currentUserRole = this.authService.getCurrentUserRole();
        //
        // if (currentUserRole !== 'admin') {
        //   // Hide sensitive information for non-admin users
        //   result.items = result.items.map((user) => ({
        //     ...user,
        //     // Hide certain fields for non-admin users
        //     createdByUserId: undefined,
        //     updatedByUserId: undefined,
        //   }));
        // }

        return result;
      }),
      catchError((error) => throwError(() => this.mapRepositoryError(error))),
    );
  }

  // protected async checkAuthorization(): Promise<boolean> {
  //   return this.authService.hasPermission('users.read');
  // }

  private mapRepositoryError(error: any): UseCaseResult<PaginatedResult<User>> {
    return this.createErrorResult(
      'USERS_FETCH_FAILED',
      'Failed to retrieve users',
      error?.errors || [
        {
          code: 'USERS_FETCH_FAILED',
          message: error?.message || 'Unknown error during users retrieval',
          severity: 'error',
          category: 'infrastructure',
        },
      ],
    );
  }
}
