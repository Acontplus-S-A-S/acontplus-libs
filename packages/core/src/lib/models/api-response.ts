export type ResponseStatus = 'success' | 'error' | 'warning';

export interface ApiError {
  code: string;
  message: string;
  target?: string;
  details?: Record<string, any>;
  severity?: string;
  category?: string;
  helpUrl?: string;
  suggestedAction?: string;
  traceId?: string;
}

export interface ApiResponse<T = any> {
  status: ResponseStatus;
  code: string;
  data?: T;
  message?: string;
  errors?: ApiError[];
  warnings?: ApiError[];
  metadata?: Record<string, any>;
  correlationId?: string;
  traceId?: string;
  timestamp: string;
}
export const isSuccessResponse = <T>(response: any): response is ApiResponse<T> =>
  response?.status === 'success';

export const isErrorResponse = (response: any): response is ApiResponse =>
  response?.status === 'error';
