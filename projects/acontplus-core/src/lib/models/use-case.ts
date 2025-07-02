// ===== CORE INTERFACES =====

// Import your existing ApiResponse interface
import { ApiError } from '../models';
import { Observable } from 'rxjs';

// Base use case interface
export interface UseCase<TRequest = void, TResponse = void> {
  execute(request: TRequest): Observable<TResponse>;
}

// Use case result that maps to your ApiResponse structure
export interface UseCaseResult<T> {
  status: 'success' | 'error' | 'warning';
  code: string;
  message?: string;
  data?: T;
  errors?: ApiError[];
  metadata?: { [key: string]: any };
  timestamp: string;
  correlationId?: string;
  traceId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Domain-specific error types for use cases
export interface DomainError extends ApiError {
  type:
    | 'business'
    | 'validation'
    | 'infrastructure'
    | 'authorization'
    | 'not_found'
    | 'conflict'
    | 'timeout'
    | 'network'
    | 'unknown';
}
