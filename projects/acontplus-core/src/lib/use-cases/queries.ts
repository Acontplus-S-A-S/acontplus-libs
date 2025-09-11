import { Observable } from 'rxjs';
import {
  FilterParams,
  PaginatedResult,
  PaginationParams,
  ValidationError,
  ErrorCategory,
} from '../models';
import { BaseUseCase } from './base.use-case';

export abstract class Queries<TRequest, TResponse> extends BaseUseCase<TRequest, TResponse> {
  // Queries typically don't need validation by default
  protected shouldValidate(): boolean {
    return false;
  }

  // Queries typically don't need authorization by default
  protected override async checkAuthorization(): Promise<boolean> {
    return true;
  }
}

export abstract class GetByIdQuery<TEntity> extends Queries<{ id: number }, TEntity> {
  // Specific validation for ID queries
  protected override validate(request: { id: number }): ValidationError[] {
    if (!request.id || request.id <= 0) {
      return [
        {
          field: 'id',
          message: 'ID must be a positive number',
          code: 'INVALID_ID',
          type: ErrorCategory.VALIDATION,
        },
      ];
    }
    return [];
  }
}

export abstract class GetAllQuery<TEntity> extends Queries<
  { pagination: PaginationParams; filters?: FilterParams },
  PaginatedResult<TEntity>
> {
  // Specific validation for pagination queries
  protected override validate(request: {
    pagination: PaginationParams;
    filters?: FilterParams;
  }): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!request.pagination) {
      errors.push({
        field: 'pagination',
        message: 'Pagination parameters are required',
        code: 'MISSING_PAGINATION',
        type: ErrorCategory.VALIDATION,
      });
    } else {
      if (!request.pagination.page || request.pagination.page < 1) {
        errors.push({
          field: 'pagination.page',
          message: 'Page must be a positive number',
          code: 'INVALID_PAGE',
          type: ErrorCategory.VALIDATION,
        });
      }

      if (!request.pagination.pageSize || request.pagination.pageSize < 1) {
        errors.push({
          field: 'pagination.pageSize',
          message: 'Page size must be a positive number',
          code: 'INVALID_PAGE_SIZE',
          type: ErrorCategory.VALIDATION,
        });
      }
    }

    return errors;
  }
}

export abstract class SearchQuery<TEntity> extends Queries<
  { query: string; pagination: PaginationParams },
  PaginatedResult<TEntity>
> {
  // Specific validation for search queries
  protected override validate(request: {
    query: string;
    pagination: PaginationParams;
  }): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!request.query || request.query.trim().length === 0) {
      errors.push({
        field: 'query',
        message: 'Search query is required',
        code: 'MISSING_QUERY',
        type: ErrorCategory.VALIDATION,
      });
    }

    // Reuse pagination validation
    const paginationErrors = this.validatePagination(request.pagination);
    errors.push(...paginationErrors);

    return errors;
  }

  private validatePagination(pagination: PaginationParams): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!pagination) {
      errors.push({
        field: 'pagination',
        message: 'Pagination parameters are required',
        code: 'MISSING_PAGINATION',
        type: ErrorCategory.VALIDATION,
      });
    } else {
      if (!pagination.page || pagination.page < 1) {
        errors.push({
          field: 'pagination.page',
          message: 'Page must be a positive number',
          code: 'INVALID_PAGE',
          type: ErrorCategory.VALIDATION,
        });
      }

      if (!pagination.pageSize || pagination.pageSize < 1) {
        errors.push({
          field: 'pagination.pageSize',
          message: 'Page size must be a positive number',
          code: 'INVALID_PAGE_SIZE',
          type: ErrorCategory.VALIDATION,
        });
      }
    }

    return errors;
  }
}

// New specialized query types
export abstract class CachedQuery<TRequest, TResponse> extends Queries<TRequest, TResponse> {
  // For queries that can be cached
  protected abstract getCacheKey(request: TRequest): string;
  protected abstract getCacheDuration(): number;

  override execute(request: TRequest): Observable<TResponse> {
    const cacheKey = this.getCacheKey(request);
    // Implementation for caching logic
    return this.executeInternal(request);
  }
}

export abstract class StreamingQuery<TRequest, TResponse> extends Queries<TRequest, TResponse> {
  // For queries that return streaming data
  protected abstract executeStreaming(request: TRequest): Observable<TResponse>;

  override execute(request: TRequest): Observable<TResponse> {
    return this.executeStreaming(request);
  }
}
