// ===== CORE INTERFACES =====

// Import your existing ApiError interface
import { ApiError } from '../models';
import { Observable } from 'rxjs';

// Base use case interface
export interface UseCase<TRequest = void, TResponse = void> {
  execute(request: TRequest): Observable<TResponse>;
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

export interface ValidationDomainError extends DomainError {
  type: ErrorCategory.VALIDATION;
  field: string;
  constraint?: string;
  value?: unknown;
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
