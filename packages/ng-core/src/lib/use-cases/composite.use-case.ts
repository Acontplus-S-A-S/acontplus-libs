import { Injectable } from '@angular/core';
import { Observable, combineLatest, switchMap, map, catchError, throwError } from 'rxjs';
import { BaseUseCase } from './base.use-case';

export interface CompositeUseCaseContext {
  correlationId?: string;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export abstract class CompositeUseCase<TRequest = void, TResponse = void> extends BaseUseCase<
  TRequest,
  TResponse
> {
  protected context?: CompositeUseCaseContext;

  // Set context for the execution
  withContext(context: CompositeUseCaseContext): this {
    this.context = context;
    return this;
  }

  // Helper method to combine multiple operations
  protected combineOperations<T1, T2>(
    op1: Observable<T1>,
    op2: Observable<T2>,
  ): Observable<[T1, T2]> {
    return combineLatest([op1, op2]);
  }

  // Helper method to chain operations
  protected chainOperations<T1, T2>(
    op1: Observable<T1>,
    op2: (result: T1) => Observable<T2>,
  ): Observable<T2> {
    return op1.pipe(switchMap(op2));
  }

  // Helper method to execute operations in parallel
  protected executeParallel<T extends readonly unknown[]>(operations: {
    [K in keyof T]: Observable<T[K]>;
  }): Observable<T> {
    return combineLatest(operations) as unknown as Observable<T>;
  }

  // Helper method to execute operations sequentially
  protected executeSequential<T extends readonly unknown[]>(operations: {
    [K in keyof T]: Observable<T[K]>;
  }): Observable<T> {
    return operations.reduce(
      (acc, op) => acc.pipe(switchMap(() => op)),
      new Observable<never>(),
    ) as Observable<T>;
  }

  // Helper method to handle rollback scenarios
  protected withRollback<T>(
    operation: Observable<T>,
    rollback: () => Observable<void>,
  ): Observable<T> {
    return operation.pipe(
      catchError(error => {
        // Execute rollback and re-throw error
        return rollback().pipe(switchMap(() => throwError(() => error)));
      }),
    );
  }

  // Helper method to create audit trail
  protected createAuditTrail(action: string, resource: string, details?: any): void {
    if (this.context) {
      // Implementation for audit logging
      console.log(`Audit: ${action} on ${resource}`, {
        ...this.context,
        details,
        action,
        resource,
      });
    }
  }
}
