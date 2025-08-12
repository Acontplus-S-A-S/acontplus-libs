export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'warning';
  code: string;
  message?: string;
  errors?: ApiError[];
  data?: T;
  metadata?: Record<string, any>;
  timestamp: string;
  correlationId?: string;
  traceId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  target?: string;
  details?: Record<string, any>;
  severity?: string;
  category?: string;
}

// Helper types for different response scenarios
export interface ApiSuccessResponse<T = any> extends Omit<ApiResponse<T>, 'status'> {
  status: 'success';
  data: T;
}

export interface ApiSuccessMessageResponse extends Omit<ApiResponse, 'status' | 'data'> {
  status: 'success';
  message: string; // Required for message-only responses
}

export interface ApiWarningResponse<T = any> extends Omit<ApiResponse<T>, 'status'> {
  status: 'warning';
  data?: T;
  message: string;
}

export interface ApiErrorResponse extends Omit<ApiResponse, 'status' | 'data'> {
  status: 'error';
  errors: ApiError[]; // Required for error responses
}

// Type guard functions
export function isApiSuccessResponse<T>(response: any): response is ApiSuccessResponse<T> {
  return response?.status === 'success' && response?.data !== undefined;
}

export function isApiSuccessMessageResponse(response: any): response is ApiSuccessMessageResponse {
  return response?.status === 'success' && response?.message && response?.data === undefined;
}

export function isApiWarningResponse<T>(response: any): response is ApiWarningResponse<T> {
  return response?.status === 'warning';
}

export function isApiErrorResponse(response: any): response is ApiErrorResponse {
  return response?.status === 'error' && response?.errors;
}
