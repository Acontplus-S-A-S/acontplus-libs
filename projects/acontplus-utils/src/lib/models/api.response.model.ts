export class ApiResponse<T = unknown> {
  code: string;
  message: string;
  payload: T | null;
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
    this.code = code;
    this.message = message;
    this.payload = payload;
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

export interface BaseEntity {
  id: number;
  createdAt?: string;
  createdByUserId?: number;
  updatedAt?: string;
  updatedByUserId?: number;
  isActive?: boolean;
}
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// Domain Result Types
export interface OperationResult<T = any> {
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
export interface SortParams {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
