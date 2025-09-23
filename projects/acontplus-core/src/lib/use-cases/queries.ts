import { Observable } from 'rxjs';
import { FilterParams, PagedResult, PaginationParams } from '../models';
import { BaseUseCase } from './base.use-case';
import { ValidationError } from './use-case';

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
        },
      ];
    }
    return [];
  }
}

export abstract class GetAllQuery<TEntity> extends Queries<
  { pagination: PaginationParams; filters?: FilterParams },
  PagedResult<TEntity>
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
      });
    } else {
      if (!request.pagination.pageIndex || request.pagination.pageIndex < 1) {
        errors.push({
          field: 'pagination.pageIndex',
          message: 'Page must be a positive number',
          code: 'INVALID_PAGE',
        });
      }

      if (!request.pagination.pageSize || request.pagination.pageSize < 1) {
        errors.push({
          field: 'pagination.pageSize',
          message: 'Page size must be a positive number',
          code: 'INVALID_PAGE_SIZE',
        });
      }
    }

    return errors;
  }
}

export abstract class SearchQuery<TEntity> extends Queries<
  { query: string; pagination: PaginationParams },
  PagedResult<TEntity>
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
      });
    } else {
      if (!pagination.pageIndex || pagination.pageIndex < 1) {
        errors.push({
          field: 'pagination.pageIndex',
          message: 'Page must be a positive number',
          code: 'INVALID_PAGE',
        });
      }

      if (!pagination.pageSize || pagination.pageSize < 1) {
        errors.push({
          field: 'pagination.pageSize',
          message: 'Page size must be a positive number',
          code: 'INVALID_PAGE_SIZE',
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
    // Implementation for caching logic
    // const cacheKey = this.getCacheKey(request); // TODO: Implement caching
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
