import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  ApiError,
  BaseEntity,
  FilterParams,
  PaginatedResult,
  PaginationParams,
} from '../models';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  protected http = inject(HttpClient);

  // Abstract property for entity name - used for dynamic URL building
  protected abstract entityName: string;

  // Abstract property for base URL - can be overridden for custom endpoints
  protected abstract baseUrl: string;

  // Optional CRUD operations - override only what you need
  getAll?(
    _pagination: PaginationParams,
    _filters?: FilterParams,
  ): Observable<PaginatedResult<T>> {
    throw new Error('getAll method not implemented');
  }

  getById?(_id: number): Observable<T> {
    throw new Error('getById method not implemented');
  }

  create?(_entity: Omit<T, 'id'>): Observable<T> {
    throw new Error('create method not implemented');
  }

  update?(_id: number, _entity: Partial<T>): Observable<T> {
    throw new Error('update method not implemented');
  }

  delete?(_id: number): Observable<boolean> {
    throw new Error('delete method not implemented');
  }

  search?(_query: string, _pagination: PaginationParams): Observable<PaginatedResult<T>> {
    throw new Error('search method not implemented');
  }

  // Protected helper methods for HTTP operations
  // The interceptor now handles all response standardization
  protected get<R>(url: string, params?: any): Observable<R> {
    return this.http.get<ApiResponse<R>>(url, { params }).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected post<R>(url: string, body: any): Observable<R> {
    return this.http.post<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected put<R>(url: string, body: any): Observable<R> {
    return this.http.put<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected patch<R>(url: string, body: any): Observable<R> {
    return this.http.patch<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected deleteHttp<R>(url: string): Observable<R> {
    return this.http.delete<ApiResponse<R>>(url).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  // Helper methods for building URLs
  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`.replace(/\/+/g, '/');
  }

  // Enhanced URL building with entity name support
  protected buildEntityUrl(endpoint?: string): string {
    const entityPath = endpoint ? `${this.entityName}/${endpoint}` : this.entityName;
    return `${this.baseUrl}/${entityPath}`.replace(/\/+/g, '/');
  }

  protected buildQueryParams(pagination: PaginationParams, filters?: FilterParams): any {
    const params: any = {
      page: pagination.page.toString(),
      pageSize: pagination.pageSize.toString(),
    };

    if (pagination.sortBy) {
      params.sortBy = pagination.sortBy;
    }

    if (pagination.sortDirection) {
      params.sortDirection = pagination.sortDirection;
    }

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value.toString();
        }
      });
    }

    return params;
  }

  // Private helper methods
  private handleHttpError<R>(error: any): Observable<R> {
    // The interceptor already handles error display and transforms the error
    // We just need to re-throw it for the consuming code to handle

    // If it's an ApiResponse error (transformed by interceptor)
    if (error?.status && error?.code) {
      throw error;
    }

    // If it's a raw HttpErrorResponse (shouldn't happen with interceptor, but safety net)
    if (error instanceof HttpErrorResponse) {
      const apiError: ApiError = {
        code: error.status?.toString() || 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        severity: 'error',
        category: 'HTTP',
      };
      throw apiError;
    }

    // Re-throw any other errors
    throw error;
  }
}
