import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRepository } from './user.repository';
import {
  ApiResponse,
  FilterParams,
  OperationResult,
  PaginatedResult,
  PaginationParams,
} from '../../../acontplus-utils/src/public-api';
import { catchError, map, Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserWebRepository extends UserRepository {
  constructor(private http: HttpClient) {
    super(http, '/api/users');
  }

  // Base CRUD Operations
  getAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Observable<OperationResult<PaginatedResult<User>>> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

    if (pagination.sortBy) {
      params = params.set('sortBy', pagination.sortBy);
    }
    if (pagination.sortDirection) {
      params = params.set('sortDirection', pagination.sortDirection);
    }

    // Add filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http
      .get<ApiResponse<PaginatedResult<User>>>(this.baseUrl, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => this.handlePaginatedResponse(response)),
        catchError((error) => this.handleError<PaginatedResult<User>>(error))
      );
  }

  getById(id: number): Observable<OperationResult<User>> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/${id}`, { observe: 'response' })
      .pipe(
        map((response) => this.handleSingleResponse(response)),
        catchError((error) => this.handleError<User>(error))
      );
  }

  create(entity: Omit<User, 'id'>): Observable<OperationResult<User>> {
    return this.http
      .post<ApiResponse<User>>(this.baseUrl, entity, { observe: 'response' })
      .pipe(
        map((response) => this.handleSingleResponse(response)),
        catchError((error) => this.handleError<User>(error))
      );
  }

  update(id: number, entity: Partial<User>): Observable<OperationResult<User>> {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/${id}`, entity, {
        observe: 'response',
      })
      .pipe(
        map((response) => this.handleSingleResponse(response)),
        catchError((error) => this.handleError<User>(error))
      );
  }

  delete(id: number): Observable<OperationResult<boolean>> {
    return this.http
      .delete<ApiResponse<any>>(`${this.baseUrl}/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => this.handleDeleteResponse(response)),
        catchError((error) => this.handleError<boolean>(error))
      );
  }

  search(
    query: string,
    pagination: PaginationParams
  ): Observable<OperationResult<PaginatedResult<User>>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', pagination.page.toString())
      .set('pageSize', pagination.pageSize.toString());

    return this.http
      .get<ApiResponse<PaginatedResult<User>>>(`${this.baseUrl}/search`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => this.handlePaginatedResponse(response)),
        catchError((error) => this.handleError<PaginatedResult<User>>(error))
      );
  }

  // User-specific operations
  getUserByEmail(email: string): Observable<OperationResult<User>> {
    return this.http
      .get<ApiResponse<User>>(
        `${this.baseUrl}/by-email/${encodeURIComponent(email)}`,
        { observe: 'response' }
      )
      .pipe(
        map((response) => this.handleSingleResponse(response)),
        catchError((error) => this.handleError<User>(error))
      );
  }

  updateUserRole(
    userId: number,
    role: string
  ): Observable<OperationResult<User>> {
    return this.http
      .patch<ApiResponse<User>>(
        `${this.baseUrl}/${userId}/role`,
        { role },
        { observe: 'response' }
      )
      .pipe(
        map((response) => this.handleSingleResponse(response)),
        catchError((error) => this.handleError<User>(error))
      );
  }

  activateUser(userId: number): Observable<OperationResult<boolean>> {
    return this.http
      .patch<ApiResponse<any>>(
        `${this.baseUrl}/${userId}/activate`,
        {},
        { observe: 'response' }
      )
      .pipe(
        map((response) => ({
          success: response.status === 200,
          data: response.status === 200,
          message:
            response.body?.message ||
            (response.status === 200
              ? 'User activated successfully'
              : 'Failed to activate user'),
          errors: response.body?.errors || [],
          statusCode: response.status,
        })),
        catchError((error) => this.handleError<boolean>(error))
      );
  }

  deactivateUser(userId: number): Observable<OperationResult<boolean>> {
    return this.http
      .patch<ApiResponse<any>>(
        `${this.baseUrl}/${userId}/deactivate`,
        {},
        { observe: 'response' }
      )
      .pipe(
        map((response) => ({
          success: response.status === 200,
          data: response.status === 200,
          message:
            response.body?.message ||
            (response.status === 200
              ? 'User deactivated successfully'
              : 'Failed to deactivate user'),
          errors: response.body?.errors || [],
          statusCode: response.status,
        })),
        catchError((error) => this.handleError<boolean>(error))
      );
  }

  bulkDelete(userIds: number[]): Observable<OperationResult<number>> {
    return this.http
      .delete<ApiResponse<{ deletedCount: number }>>(`${this.baseUrl}/bulk`, {
        body: { ids: userIds },
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          success: response.status >= 200 && response.status < 300,
          data: response.body?.payload?.deletedCount || 0,
          message:
            response.body?.message ||
            `${response.body?.payload?.deletedCount || 0} users deleted`,
          errors: response.body?.errors || [],
          statusCode: response.status,
        })),
        catchError((error) => this.handleError<number>(error))
      );
  }
}
