import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { BaseUseCase } from './base-use-case';
import { LoggingService } from '../services/logging-service';

export abstract class Query<TRequest, TResponse> extends BaseUseCase<TRequest, TResponse> {
  override execute(request: TRequest): Observable<TResponse> {
    return this.executeInternal(request).pipe(
      catchError(error => {
        const logger = inject(LoggingService);
        logger.error('An error occurred during query execution:', error);
        return throwError(() => error);
      }),
    );
  }

  protected abstract executeInternal(request: TRequest): Observable<TResponse>;
}
