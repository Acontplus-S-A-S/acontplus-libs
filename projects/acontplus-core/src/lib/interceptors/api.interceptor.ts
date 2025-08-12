import {
  HttpInterceptorFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrNotificationService } from '../services';
import { ApiResponse, ApiError } from '../models';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrNotificationService);

  return next(req).pipe(
    retry({ count: 2, delay: 1000 }),
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        return handleSuccessResponse(event, toastr, req);
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => handleErrorResponse(error, toastr)),
  );
};

function handleSuccessResponse(
  event: HttpResponse<any>,
  toastr: ToastrNotificationService,
  req: any,
): HttpResponse<any> {
  const body = event.body;

  // Standardize the response to always have ApiResponse structure
  const standardizedResponse = standardizeApiResponse(body, req);

  // Handle toast notifications based on standardized response
  handleToastNotifications(standardizedResponse, toastr, req);

  // Return the appropriate data based on response type
  return transformResponseForConsumers(standardizedResponse, event);
}

function handleErrorResponse(error: HttpErrorResponse, toastr: ToastrNotificationService) {
  const apiError = error.error;

  // Standardize error response
  const standardizedError = standardizeErrorResponse(apiError, error);

  // Show error toast
  const message = standardizedError.message || 'An error occurred';
  toastr.error({ message });

  return throwError(() => standardizedError);
}

/**
 * Standardizes any response to follow the ApiResponse structure
 */
function standardizeApiResponse(body: any, req: any): ApiResponse<any> {
  // If it's already a proper ApiResponse, return as is
  if (isValidApiResponse(body)) {
    return body;
  }

  // If it's a raw data response (no wrapper), wrap it
  if (body && typeof body === 'object' && !('status' in body)) {
    return {
      status: 'success',
      code: '200',
      message: 'Operation completed successfully',
      data: body,
      timestamp: new Date().toISOString(),
    };
  }

  // If it's a primitive value, wrap it
  if (body !== null && body !== undefined && typeof body !== 'object') {
    return {
      status: 'success',
      code: '200',
      message: 'Operation completed successfully',
      data: body,
      timestamp: new Date().toISOString(),
    };
  }

  // If it's null/undefined, create a success response without data
  return {
    status: 'success',
    code: '200',
    message: 'Operation completed successfully',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Standardizes error responses
 */
function standardizeErrorResponse(apiError: any, httpError: HttpErrorResponse): ApiError {
  if (apiError?.status === 'error' && apiError?.errors?.length > 0) {
    // Already a proper API error
    return apiError.errors[0];
  }

  if (apiError?.code && apiError?.message) {
    // Has error structure but not in array format
    return {
      code: apiError.code,
      message: apiError.message,
      target: apiError.target,
      details: apiError.details,
      severity: apiError.severity || 'error',
      category: apiError.category || 'http',
    };
  }

  // Fallback to HTTP error information
  return {
    code: httpError.status?.toString() || 'UNKNOWN_ERROR',
    message: apiError?.message || httpError.message || 'An unexpected error occurred',
    severity: 'error',
    category: 'http',
  };
}

/**
 * Handles toast notifications based on standardized response
 */
function handleToastNotifications(
  response: ApiResponse<any>,
  toastr: ToastrNotificationService,
  req: any,
): void {
  const shouldShowToast = shouldShowSuccessToast(req, response);

  switch (response.status) {
    case 'success':
      if (response.message && shouldShowToast) {
        toastr.success({ message: response.message });
      }
      break;
    case 'warning':
      if (response.message) {
        toastr.warning({ message: response.message });
      }
      break;
    case 'error':
      if (response.message) {
        toastr.error({ message: response.message });
      }
      break;
  }
}

/**
 * Transforms the standardized response for consumers
 */
function transformResponseForConsumers(
  response: ApiResponse<any>,
  originalEvent: HttpResponse<any>,
): HttpResponse<any> {
  switch (response.status) {
    case 'success':
      // For success responses, return the data if it exists, otherwise the full response
      if (response.data !== undefined && response.data !== null) {
        return originalEvent.clone({ body: response.data });
      }
      // For message-only success responses, return the full response
      return originalEvent.clone({ body: response });

    case 'warning':
      // For warnings, return data if it exists, otherwise the full response
      if (response.data !== undefined && response.data !== null) {
        return originalEvent.clone({ body: response.data });
      }
      return originalEvent.clone({ body: response });

    case 'error':
      // Errors should be thrown, not returned
      throw response;

    default:
      return originalEvent.clone({ body: response });
  }
}

/**
 * Determines whether to show success toast notifications based on the request type
 */
function shouldShowSuccessToast(req: any, response: ApiResponse<any>): boolean {
  const url = req.url?.toLowerCase() || '';
  const method = req.method?.toLowerCase() || '';

  // Don't show success toast for GET requests (queries/lists) by default
  if (method === 'get') {
    return false;
  }

  // Don't show success toast for list/query endpoints by default
  if (url.includes('/list') || url.includes('/search') || url.includes('/query')) {
    return false;
  }

  // Don't show success toast for pagination endpoints by default
  if (url.includes('/page') || url.includes('/paginated')) {
    return false;
  }

  // Don't show success toast for health check or status endpoints by default
  if (url.includes('/health') || url.includes('/status') || url.includes('/ping')) {
    return false;
  }

  // Show success toast for POST, PUT, PATCH, DELETE operations by default
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    return true;
  }

  // Default: show for non-GET requests, don't show for GET requests
  return method !== 'get';
}

/**
 * Checks if a response is a valid ApiResponse
 */
function isValidApiResponse(response: any): response is ApiResponse<any> {
  return (
    response &&
    typeof response === 'object' &&
    'status' in response &&
    'code' in response &&
    ['success', 'error', 'warning'].includes(response.status)
  );
}
