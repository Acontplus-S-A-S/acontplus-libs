import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiResponse,
  ApiError,
  BaseEntity,
  FilterParams,
  PagedResult,
  PaginationParams,
} from '@acontplus/core';
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
  getAll?(_pagination: PaginationParams, _filters?: FilterParams): Observable<PagedResult<T>> {
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

  search?(_query: string, _pagination: PaginationParams): Observable<PagedResult<T>> {
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

  // New method to get full API response (useful for handling warnings)
  protected getFullResponse<R>(url: string, params?: any): Observable<ApiResponse<R>> {
    return this.http.get<ApiResponse<R>>(url, { params }).pipe(
      map(response => {
        // If interceptor extracted data, reconstruct full response
        if (response && typeof response === 'object' && !('status' in response)) {
          return {
            status: 'success' as const,
            code: '200',
            message: 'Operation completed successfully',
            data: response,
            timestamp: new Date().toISOString(),
          } as ApiResponse<R>;
        }
        return response as ApiResponse<R>;
      }),
      catchError(error => this.handleHttpError<ApiResponse<R>>(error)),
    );
  }

  protected post<R>(url: string, body: any): Observable<R> {
    return this.http.post<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected postFullResponse<R>(url: string, body: any): Observable<ApiResponse<R>> {
    return this.http.post<ApiResponse<R>>(url, body).pipe(
      map(response => {
        // If interceptor extracted data, reconstruct full response
        if (response && typeof response === 'object' && !('status' in response)) {
          return {
            status: 'success' as const,
            code: '200',
            message: 'Operation completed successfully',
            data: response,
            timestamp: new Date().toISOString(),
          } as ApiResponse<R>;
        }
        return response as ApiResponse<R>;
      }),
      catchError(error => this.handleHttpError<ApiResponse<R>>(error)),
    );
  }

  protected put<R>(url: string, body: any): Observable<R> {
    return this.http.put<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected putFullResponse<R>(url: string, body: any): Observable<ApiResponse<R>> {
    return this.http.put<ApiResponse<R>>(url, body).pipe(
      map(response => {
        // If interceptor extracted data, reconstruct full response
        if (response && typeof response === 'object' && !('status' in response)) {
          return {
            status: 'success' as const,
            code: '200',
            message: 'Operation completed successfully',
            data: response,
            timestamp: new Date().toISOString(),
          } as ApiResponse<R>;
        }
        return response as ApiResponse<R>;
      }),
      catchError(error => this.handleHttpError<ApiResponse<R>>(error)),
    );
  }

  protected patch<R>(url: string, body: any): Observable<R> {
    return this.http.patch<ApiResponse<R>>(url, body).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected patchFullResponse<R>(url: string, body: any): Observable<ApiResponse<R>> {
    return this.http.patch<ApiResponse<R>>(url, body).pipe(
      map(response => {
        // If interceptor extracted data, reconstruct full response
        if (response && typeof response === 'object' && !('status' in response)) {
          return {
            status: 'success' as const,
            code: '200',
            message: 'Operation completed successfully',
            data: response,
            timestamp: new Date().toISOString(),
          } as ApiResponse<R>;
        }
        return response as ApiResponse<R>;
      }),
      catchError(error => this.handleHttpError<ApiResponse<R>>(error)),
    );
  }

  protected deleteHttp<R>(url: string): Observable<R> {
    return this.http.delete<ApiResponse<R>>(url).pipe(
      map(response => response as R), // Interceptor already extracts data
      catchError(error => this.handleHttpError<R>(error)),
    );
  }

  protected deleteFullResponse<R>(url: string): Observable<ApiResponse<R>> {
    return this.http.delete<ApiResponse<R>>(url).pipe(
      map(response => {
        // If interceptor extracted data, reconstruct full response
        if (response && typeof response === 'object' && !('status' in response)) {
          return {
            status: 'success' as const,
            code: '200',
            message: 'Operation completed successfully',
            data: response,
            timestamp: new Date().toISOString(),
          } as ApiResponse<R>;
        }
        return response as ApiResponse<R>;
      }),
      catchError(error => this.handleHttpError<ApiResponse<R>>(error)),
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
      page: pagination.pageIndex.toString(),
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

  // Helper methods for working with warnings and full API responses
  protected hasWarnings(response: ApiResponse<any>): boolean {
    return !!(response.warnings && response.warnings.length > 0);
  }

  protected hasErrors(response: ApiResponse<any>): boolean {
    return !!(response.errors && response.errors.length > 0);
  }

  protected isWarningResponse(response: ApiResponse<any>): boolean {
    return response.status === 'warning';
  }

  protected isSuccessResponse(response: ApiResponse<any>): boolean {
    return response.status === 'success';
  }

  protected isErrorResponse(response: ApiResponse<any>): boolean {
    return response.status === 'error';
  }

  // Helper method to extract warnings from API response
  protected extractWarnings(response: ApiResponse<any>): ApiError[] {
    return response.warnings || [];
  }

  // Helper method to extract errors from API response
  protected extractErrors(response: ApiResponse<any>): ApiError[] {
    return response.errors || [];
  }

  // Helper method to log warnings (useful for debugging)
  protected logWarnings(response: ApiResponse<any>, context = 'Repository'): void {
    if (this.hasWarnings(response)) {
      // eslint-disable-next-line no-console
      console.warn(`${context} Warning [${response.code}]: ${response.message}`);
      response.warnings?.forEach(warning => {
        // eslint-disable-next-line no-console
        console.warn(`  - ${warning.code}: ${warning.message}`);
      });
    }
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
