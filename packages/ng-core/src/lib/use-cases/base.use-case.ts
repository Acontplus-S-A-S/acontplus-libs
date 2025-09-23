import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiError, ApiResponse } from '@acontplus/core';
import { ResponseHandlerService, LoggingService } from '../services';
import { UseCase, ValidationError } from './use-case';

export abstract class BaseUseCase<TRequest = void, TResponse = void>
  implements UseCase<TRequest, TResponse>
{
  protected responseHandler = new ResponseHandlerService();
  protected loggingService = inject(LoggingService);

  // Main execution method - can be overridden for custom behavior
  execute(request: TRequest): Observable<TResponse> {
    return this.executeInternal(request);
  }

  // Internal execution method - override this in concrete classes
  protected abstract executeInternal(request: TRequest): Observable<TResponse>;

  // Optional validation - override only when needed
  protected validate(_request: TRequest): ValidationError[] {
    return [];
  }

  // Optional authorization - override only when needed
  protected async checkAuthorization(_request: TRequest): Promise<boolean> {
    return true;
  }

  // Helper method to create ApiResponse success result
  protected createSuccessResult<T>(
    data: T,
    message?: string,
    code = 'SUCCESS',
    metadata?: Record<string, any>,
  ): ApiResponse<T> {
    return {
      status: 'success',
      code,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper method to create ApiResponse warning result
  protected createWarningResult<T>(
    data: T,
    code: string,
    message: string,
    warnings?: ApiError[],
    metadata?: Record<string, any>,
  ): ApiResponse<T> {
    return {
      status: 'warning',
      code,
      message,
      data,
      warnings,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }

  // Helper method to create ApiResponse error result
  protected createErrorResult<T>(
    code: string,
    message: string,
    errors?: ApiError[],
    metadata?: Record<string, any>,
  ): ApiResponse<T> {
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
  protected createValidationErrorResult<T>(validationErrors: ValidationError[]): ApiResponse<T> {
    const apiErrors: ApiError[] = validationErrors.map(ve => ({
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

  // Execute with validation and error handling wrapper - optional
  protected executeWithValidation(request: TRequest): Observable<TResponse> {
    return new Observable<TResponse>(observer => {
      // Pre-execution validation
      const validationErrors = this.validate(request);
      if (validationErrors.length > 0) {
        const errorResult = this.createValidationErrorResult(validationErrors);
        observer.error(errorResult);
        return;
      }

      // Authorization check
      this.checkAuthorization(request)
        .then(authorized => {
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
          this.executeInternal(request).subscribe({
            next: result => observer.next(result),
            error: error => observer.error(this.handleError(error)),
            complete: () => observer.complete(),
          });
        })
        .catch(error => {
          observer.error(this.handleError(error));
        });
    });
  }

  // Centralized error handling that maps to ApiResponse structure
  protected handleError(error: any): ApiResponse<any> {
    // If it's already an ApiResponse structure, return as is
    if (error?.status && ['success', 'error', 'warning'].includes(error.status)) {
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
    return this.createErrorResult('UNEXPECTED_ERROR', 'An unexpected error occurred', [
      {
        code: 'UNEXPECTED_ERROR',
        message: error?.message || 'Unknown error',
        severity: 'error',
        category: 'infrastructure',
        details: error,
      },
    ]);
  }

  // Helper to extract data from ApiResponse (for repository responses)
  protected extractFromApiResponse<T>(response: ApiResponse<T>): T {
    if (response.status === 'error') {
      throw response;
    }

    if (response.status === 'warning') {
      // Use the new warning handler
      return this.handleWarningResponse(response);
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

  // Helper to check if response has warnings
  protected hasWarningsInResponse(response: any): boolean {
    return response?.warnings && response.warnings.length > 0;
  }

  // Helper to extract warnings from API response
  protected extractWarningsFromApiResponse(response: any): ApiError[] {
    return response?.warnings || [];
  }

  // Helper to check if response is a warning response
  protected isWarningResponse(response: any): boolean {
    return response?.status === 'warning';
  }

  // Helper to handle warning responses (log warnings but continue with data)
  protected handleWarningResponse<T>(response: ApiResponse<T>): T {
    if (response.status === 'warning') {
      // Log warning but continue with data
      this.loggingService.warn(`Use Case Warning [${response.code}]: ${response.message}`);

      // Log individual warnings if they exist
      if (response.warnings && response.warnings.length > 0) {
        response.warnings.forEach(warning => {
          this.loggingService.warn(`  - ${warning.code}: ${warning.message}`);
        });
      }
    }

    return this.responseHandler.extractData<T>(response);
  }

  // Helper to create warning from API response (useful for propagating warnings)
  protected createWarningFromApiResponse<T>(
    response: ApiResponse<T>,
    customMessage?: string,
  ): ApiResponse<T> {
    return {
      status: 'warning',
      code: response.code,
      message: customMessage || response.message || 'Operation completed with warnings',
      data: response.data,
      warnings: response.warnings,
      metadata: response.metadata,
      correlationId: response.correlationId,
      traceId: response.traceId,
      timestamp: response.timestamp,
    };
  }
}
