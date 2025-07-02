export interface ApiResponse<T = any> {
  status: 'success' | 'error' | 'warning';
  code: string;
  message?: string;
  errors?: ApiError[];
  data?: T;
  metadata?: { [key: string]: any };
  timestamp: string;
  correlationId?: string;
  traceId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  target?: string;
  details?: { [key: string]: any };
  severity?: string;
  category?: string;
}
