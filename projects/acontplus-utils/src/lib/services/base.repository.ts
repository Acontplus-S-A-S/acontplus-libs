import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import {
  ApiResponse,
  BaseEntity,
  FilterParams,
  OperationResult,
  PaginatedResult,
  PaginationParams,
} from '../models';
import { Observable, of } from 'rxjs';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected http: HttpClient, protected baseUrl: string) {}

  abstract getAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Observable<OperationResult<PaginatedResult<T>>>;
  abstract getById(id: number): Observable<OperationResult<T>>;
  abstract create(entity: Omit<T, 'id'>): Observable<OperationResult<T>>;
  abstract update(
    id: number,
    entity: Partial<T>
  ): Observable<OperationResult<T>>;
  abstract delete(id: number): Observable<OperationResult<boolean>>;
  abstract search(
    query: string,
    pagination: PaginationParams
  ): Observable<OperationResult<PaginatedResult<T>>>;

  // Shared response handling methods
  protected handleSingleResponse(
    response: HttpResponse<ApiResponse<T>>
  ): OperationResult<T> {
    const body = response.body;

    switch (response.status) {
      case 200: // OK
      case 201: // Created
        return {
          success: true,
          data: body?.payload || null,
          message: body?.message || this.getSuccessMessage(response.status),
          errors: [],
          statusCode: response.status,
        };

      case 204: // No Content
        return {
          success: true,
          data: null,
          message: 'Operation completed successfully',
          errors: [],
          statusCode: 204,
        };

      default:
        return {
          success: false,
          data: null,
          message: body?.message || 'Unexpected response',
          errors: body?.errors || [],
          statusCode: response.status,
        };
    }
  }

  protected handlePaginatedResponse(
    response: HttpResponse<ApiResponse<PaginatedResult<T>>>
  ): OperationResult<PaginatedResult<T>> {
    const body = response.body;

    const defaultPagination: PaginatedResult<T> = {
      items: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    switch (response.status) {
      case 200:
        return {
          success: true,
          data: body?.payload || defaultPagination,
          message:
            body?.message || `Found ${body?.payload?.totalCount || 0} items`,
          errors: [],
          statusCode: 200,
        };

      case 204:
        return {
          success: true,
          data: defaultPagination,
          message: 'No items found',
          errors: [],
          statusCode: 204,
        };

      default:
        return {
          success: false,
          data: defaultPagination,
          message: body?.message || 'Failed to retrieve items',
          errors: body?.errors || [],
          statusCode: response.status,
        };
    }
  }

  protected handleDeleteResponse(
    response: HttpResponse<ApiResponse<any>>
  ): OperationResult<boolean> {
    const body = response.body;

    switch (response.status) {
      case 200:
      case 204:
      case 202: // Accepted (async delete)
        return {
          success: true,
          data: true,
          message: body?.message || 'Item deleted successfully',
          errors: [],
          statusCode: response.status,
        };

      default:
        return {
          success: false,
          data: false,
          message: body?.message || 'Delete operation failed',
          errors: body?.errors || [],
          statusCode: response.status,
        };
    }
  }

  protected handleError<R>(
    error: HttpErrorResponse
  ): Observable<OperationResult<R>> {
    console.error(`Repository Error [${error.status}]:`, error);

    let message = 'An unexpected error occurred';
    let errors: string[] = [];

    // Extract error information from ApiResponse
    if (error.error && typeof error.error === 'object') {
      const errorResponse = error.error as ApiResponse<any>;
      if (errorResponse.message) {
        message = errorResponse.message;
      }
      if (errorResponse.errors) {
        errors = errorResponse.errors;
      }
    }

    // Default messages based on status code
    if (message === 'An unexpected error occurred') {
      message = this.getErrorMessage(error.status);
    }

    const result: OperationResult<R> = {
      success: false,
      data: null as R,
      message,
      errors,
      statusCode: error.status,
    };

    return of(result);
  }

  private getSuccessMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Operation completed successfully';
      case 201:
        return 'Item created successfully';
      case 202:
        return 'Request accepted for processing';
      case 204:
        return 'Operation completed';
      default:
        return 'Success';
    }
  }

  private getErrorMessage(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Item not found';
      case 409:
        return 'Conflict with existing data';
      case 422:
        return 'Validation failed';
      case 429:
        return 'Too many requests';
      case 500:
        return 'Internal server error';
      case 502:
        return 'Bad gateway';
      case 503:
        return 'Service unavailable';
      case 504:
        return 'Gateway timeout';
      default:
        return 'An unexpected error occurred';
    }
  }
}
