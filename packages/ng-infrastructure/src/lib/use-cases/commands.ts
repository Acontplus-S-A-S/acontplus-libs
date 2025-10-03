import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { BaseUseCase } from './base.use-case';
import { LoggingService } from '../services/logging.service';

// Only create commands if you have complex validation logic
export abstract class Command<TRequest, TResponse = void> extends BaseUseCase<TRequest, TResponse> {
  // Simple validation - override only when needed
  protected validate(_request: TRequest): string[] {
    return []; // Return array of error messages
  }

  override execute(request: TRequest): Observable<TResponse> {
    const errors = this.validate(request);
    if (errors.length > 0) {
      return throwError(() => ({
        status: 'error',
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        errors: errors.map(msg => ({ code: 'VALIDATION', message: msg })),
        timestamp: new Date().toISOString(),
      }));
    }

    return this.executeInternal(request).pipe(
      catchError(error => {
        // Log the error for debugging
        const logger = inject(LoggingService);
        logger.error('An error occurred during command execution:', error);

        // Re-throw the error so the caller can handle it
        return throwError(() => error);
      }),
    );
  }

  protected abstract executeInternal(request: TRequest): Observable<TResponse>;
}
