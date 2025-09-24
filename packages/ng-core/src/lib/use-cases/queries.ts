import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseUseCase } from './base.use-case';

export abstract class Query<TRequest, TResponse> extends BaseUseCase<TRequest, TResponse> {
  override execute(request: TRequest): Observable<TResponse> {
    return this.executeInternal(request).pipe(
      catchError(error => {
        console.error('An error occurred during query execution:', error);
        return throwError(() => error);
      }),
    );
  }

  protected abstract executeInternal(request: TRequest): Observable<TResponse>;
}
