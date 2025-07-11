import { Observable } from 'rxjs';
import {
  ApiError,
  ApiResponse,
  UseCase,
  UseCaseResult,
  ValidationError,
} from '../models';
import { ResponseHandlerService } from '../services';

export abstract class BaseUseCase<TRequest = void, TResponse = void>
  implements UseCase<TRequest, TResponse>
{
  protected responseHandler = new ResponseHandlerService();

  abstract execute(request: TRequest): Observable<TResponse>;

  // Helper method for validation
  protected validate(request: TRequest): ValidationError[] {
    // Override in concrete classes for specific validation
    return [];
  }

  // Helper method for authorization checks
  protected async checkAuthorization(request: TRequest): Promise<boolean> {
    // Override in concrete classes for specific authorization
    return true;
  }

  // Helper method to create ApiResponse-compatible success result
  protected createSuccessResult<T>(
    data: T,
    message?: string,
    code: string = 'SUCCESS',
    metadata?: { [key: string]: any },
  ): UseCaseResult<T> {
    return {
      status: 'success',
      code,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper method to create ApiResponse-compatible warning result
  protected createWarningResult<T>(
    data: T,
    code: string,
    message: string,
    metadata?: { [key: string]: any },
  ): UseCaseResult<T> {
    return {
      status: 'warning',
      code,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper method to create ApiResponse-compatible error result
  protected createErrorResult<T>(
    code: string,
    message: string,
    errors?: ApiError[],
    metadata?: { [key: string]: any },
  ): UseCaseResult<T> {
    return {
      status: 'error',
      code,
      message,
      errors,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper method to create validation error result
  protected createValidationErrorResult<T>(
    validationErrors: ValidationError[],
  ): UseCaseResult<T> {
    const apiErrors: ApiError[] = validationErrors.map((ve) => ({
      code: ve.code,
      message: ve.message,
      target: ve.field,
      severity: 'error',
      category: 'validation',
    }));

    return {
      status: 'error',
      code: 'VALIDATION_FAILED',
      message: 'One or more validation errors occurred',
      errors: apiErrors,
      timestamp: new Date().toISOString(),
    };
  }

  // Execute with validation and error handling wrapper
  protected executeWithValidation(request: TRequest): Observable<TResponse> {
    return new Observable<TResponse>((observer) => {
      // Pre-execution validation
      const validationErrors = this.validate(request);
      if (validationErrors.length > 0) {
        const errorResult = this.createValidationErrorResult(validationErrors);
        observer.error(errorResult);
        return;
      }

      // Authorization check
      this.checkAuthorization(request)
        .then((authorized) => {
          if (!authorized) {
            const errorResult = this.createErrorResult(
              'UNAUTHORIZED',
              'You are not authorized to perform this action',
              [
                {
                  code: 'UNAUTHORIZED',
                  message: 'Insufficient permissions',
                  severity: 'error',
                  category: 'authorization',
                },
              ],
            );
            observer.error(errorResult);
            return;
          }

          // Execute the actual use case
          this.execute(request).subscribe({
            next: (result) => observer.next(result),
            error: (error) => observer.error(this.handleError(error)),
            complete: () => observer.complete(),
          });
        })
        .catch((error) => {
          observer.error(this.handleError(error));
        });
    });
  }

  // Centralized error handling that maps to ApiResponse structure
  private handleError(error: any): UseCaseResult<any> {
    // If it's already an ApiResponse structure, return as is
    if (
      error?.status &&
      ['success', 'error', 'warning'].includes(error.status)
    ) {
      return error;
    }

    // If it's a domain error from repository/interceptor
    if (error?.code && error?.message) {
      return this.createErrorResult(
        error.code,
        error.message,
        error.errors || [error],
        error.metadata,
      );
    }

    // Handle unexpected errors
    return this.createErrorResult(
      'UNEXPECTED_ERROR',
      'An unexpected error occurred',
      [
        {
          code: 'UNEXPECTED_ERROR',
          message: error?.message || 'Unknown error',
          severity: 'error',
          category: 'infrastructure',
          details: error,
        },
      ],
    );
  }

  // Helper to extract data from ApiResponse (for repository responses)
  protected extractFromApiResponse<T>(response: ApiResponse<T>): T {
    if (response.status === 'error') {
      throw response;
    }

    if (response.status === 'warning') {
      // Log warning but continue with data
      console.warn(`Use Case Warning [${response.code}]:`, response.message);
    }

    return this.responseHandler.extractData<T>(response);
  }

  // Helper to extract message from ApiResponse (for operations that return success messages)
  protected extractMessageFromApiResponse(response: any): string | undefined {
    return this.responseHandler.extractMessage(response);
  }

  // Helper to check if response has data
  protected hasDataInResponse(response: any): boolean {
    return this.responseHandler.hasData(response);
  }

  // Helper to check if response has message
  protected hasMessageInResponse(response: any): boolean {
    return this.responseHandler.hasMessage(response);
  }
}
