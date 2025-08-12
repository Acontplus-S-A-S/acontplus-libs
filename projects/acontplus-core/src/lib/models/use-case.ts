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
  metadata?: Record<string, any>;
  timestamp: string;
  correlationId?: string;
  traceId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Enhanced domain-specific error types for use cases
export enum ErrorCategory {
  BUSINESS = 'business',
  VALIDATION = 'validation',
  INFRASTRUCTURE = 'infrastructure',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

export interface DomainError extends ApiError {
  type: ErrorCategory;
  recoverable?: boolean;
  retryable?: boolean;
  userActionable?: boolean;
}

// Specific error types for common scenarios
export interface BusinessRuleError extends DomainError {
  type: ErrorCategory.BUSINESS;
  ruleId: string;
  businessContext?: string;
}

export interface ValidationError extends DomainError {
  type: ErrorCategory.VALIDATION;
  field: string;
  constraint?: string;
  value?: any;
}

export interface AuthorizationError extends DomainError {
  type: ErrorCategory.AUTHORIZATION;
  requiredPermissions?: string[];
  userRole?: string;
  resource?: string;
}

export interface NotFoundError extends DomainError {
  type: ErrorCategory.NOT_FOUND;
  resourceType: string;
  resourceId: string | number;
}

export interface ConflictError extends DomainError {
  type: ErrorCategory.CONFLICT;
  conflictingResource?: string;
  conflictReason?: string;
}
