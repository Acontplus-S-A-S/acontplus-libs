// Your existing ApiResponse (Legacy - keep for backward compatibility)
export class ApiResponse<T = unknown> {
  code: string;
  message: string;
  payload: T | null;

  constructor(code = '0', message = '', payload: T | null = null) {
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
}

// Enhanced ApiResponse with additional properties
export class EnhancedApiResponse<T = unknown> extends ApiResponse<T> {
  success: boolean;
  statusCode: number;
  errors?: string[];
  metadata?: ResponseMetadata;
  timestamp: string;

  constructor(
    code = '0',
    message = '',
    payload: T | null = null,
    statusCode = 200,
    success?: boolean,
    errors?: string[],
    metadata?: ResponseMetadata
  ) {
    super(code, message, payload);
    this.success = success ?? (statusCode >= 200 && statusCode < 300);
    this.statusCode = statusCode;
    this.errors = errors;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }
}

export interface ResponseMetadata {
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  executionTime?: number;
  version?: string;
}

// Type guards
export function isApiResponse<T = unknown>(
  object: unknown
): object is ApiResponse<T> {
  return (
    typeof object === 'object' &&
    object !== null &&
    'code' in object &&
    'message' in object &&
    'payload' in object
  );
}

export function isEnhancedApiResponse<T = unknown>(
  object: unknown
): object is EnhancedApiResponse<T> {
  return (
    isApiResponse<T>(object) &&
    'success' in object &&
    'statusCode' in object &&
    'timestamp' in object
  );
}

// ============= OPERATION RESULT TYPES =============

export interface OperationResult<T = unknown> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============= ENTITY INTERFACES =============

export interface BaseEntity {
  id: number;
  createdAt?: string;
  createdByUserId?: number;
  updatedAt?: string;
  updatedByUserId?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedByUserId?: number;
}
