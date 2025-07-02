import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {
  ApiResponse,
  ApiError,
  BaseEntity,
  FilterParams,
  PaginatedResult,
  PaginationParams,
} from '../models';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
  ) {}

  abstract getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<T>>;

  abstract getById(id: number): Observable<T>;

  abstract create(entity: Omit<T, 'id'>): Observable<T>;

  abstract update(id: number, entity: Partial<T>): Observable<T>;

  abstract delete(id: number): Observable<boolean>;

  abstract search(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<T>>;

  // Protected helper methods for HTTP operations
  protected get<R>(url: string, params?: any): Observable<R> {
    return this.http.get<ApiResponse<R>>(url, { params }).pipe(
      map((response) => this.extractData<R>(response)),
      catchError((error) => this.handleHttpError<R>(error)),
    );
  }

  protected post<R>(url: string, body: any): Observable<R> {
    return this.http.post<ApiResponse<R>>(url, body).pipe(
      map((response) => this.extractData<R>(response)),
      catchError((error) => this.handleHttpError<R>(error)),
    );
  }

  protected put<R>(url: string, body: any): Observable<R> {
    return this.http.put<ApiResponse<R>>(url, body).pipe(
      map((response) => this.extractData<R>(response)),
      catchError((error) => this.handleHttpError<R>(error)),
    );
  }

  protected patch<R>(url: string, body: any): Observable<R> {
    return this.http.patch<ApiResponse<R>>(url, body).pipe(
      map((response) => this.extractData<R>(response)),
      catchError((error) => this.handleHttpError<R>(error)),
    );
  }

  protected deleteHttp<R>(url: string): Observable<R> {
    return this.http.delete<ApiResponse<R>>(url).pipe(
      map((response) => this.extractData<R>(response)),
      catchError((error) => this.handleHttpError<R>(error)),
    );
  }

  // Helper methods for building URLs
  protected buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`.replace(/\/+/g, '/');
  }

  protected buildQueryParams(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): any {
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
      Object.keys(filters).forEach((key) => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params[key] = value.toString();
        }
      });
    }

    return params;
  }

  // Private helper methods
  private extractData<R>(response: ApiResponse<R>): R {
    // The interceptor already extracts the data from ApiResponse
    // If data is null/undefined, we might want to handle it differently based on the operation
    if (response.data === undefined || response.data === null) {
      // For operations that might legitimately return null (like delete)
      return response.data as R;
    }
    return response.data;
  }

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