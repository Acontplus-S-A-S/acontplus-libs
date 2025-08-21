import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BaseUseCase } from './base.use-case';
import { ValidationError } from '../models';

export abstract class Command<TRequest, TResponse = void> extends BaseUseCase<
  TRequest,
  TResponse
> {
  // Optional validation - can be overridden
  protected override validate(request: TRequest): ValidationError[] {
    return [];
  }

  // Optional authorization - can be overridden
  protected override async checkAuthorization(request: TRequest): Promise<boolean> {
    return true;
  }

  // Execute with validation if needed
  override execute(request: TRequest): Observable<TResponse> {
    if (this.shouldValidate()) {
      return this.executeWithValidation(request);
    }
    return this.executeInternal(request);
  }

  // Override to control validation behavior
  protected shouldValidate(): boolean {
    return true;
  }
}

export abstract class CreateCommand<TEntity, TResponse = TEntity> extends Command<
  Omit<TEntity, 'id'>,
  TResponse
> {
  // Specific validation for creation
  protected override validate(request: Omit<TEntity, 'id'>): ValidationError[] {
    return this.validateForCreation(request);
  }

  // Override for specific creation validation
  protected validateForCreation(request: Omit<TEntity, 'id'>): ValidationError[] {
    return [];
  }
}

export abstract class UpdateCommand<TEntity, TResponse = TEntity> extends Command<
  { id: number; data: Partial<TEntity> },
  TResponse
> {
  // Specific validation for updates
  protected override validate(request: { id: number; data: Partial<TEntity> }): ValidationError[] {
    return this.validateForUpdate(request);
  }

  // Override for specific update validation
  protected validateForUpdate(request: { id: number; data: Partial<TEntity> }): ValidationError[] {
    return [];
  }
}

export abstract class DeleteCommand extends Command<{ id: number }, boolean> {
  // Specific validation for deletion
  protected override validate(request: { id: number }): ValidationError[] {
    return this.validateForDeletion(request);
  }

  // Override for specific deletion validation
  protected validateForDeletion(request: { id: number }): ValidationError[] {
    return [];
  }
}

// New specialized command types
export abstract class BulkCommand<TRequest, TResponse> extends Command<TRequest, TResponse> {
  // For bulk operations
  protected abstract executeBulk(request: TRequest): Observable<TResponse>;
}

export abstract class ConditionalCommand<TRequest, TResponse> extends Command<TRequest, TResponse> {
  // For operations that depend on conditions
  protected abstract checkConditions(request: TRequest): Observable<boolean>;

  override execute(request: TRequest): Observable<TResponse> {
    return this.checkConditions(request).pipe(
      switchMap(conditionsMet => {
        if (!conditionsMet) {
          return throwError(() => this.createErrorResult(
            'CONDITIONS_NOT_MET',
            'Required conditions are not met for this operation'
          ));
        }
        return this.executeInternal(request);
      })
    );
  }
}
