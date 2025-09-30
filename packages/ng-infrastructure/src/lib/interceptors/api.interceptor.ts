import {
  HttpInterceptorFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpRequest,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiResponse } from '@acontplus/core';
import { NotificationService } from '@acontplus/ng-notifications';
import { TOKEN_PROVIDER } from '../interfaces/token-provider.interface';

// A token to use with HttpContext for skipping notifications on specific requests.
export const SKIP_NOTIFICATION = new HttpContextToken<boolean>(() => false);

// A token to use with HttpContext for forcing notifications on specific requests (overrides exclusion patterns).
export const SHOW_NOTIFICATIONS = new HttpContextToken<boolean | undefined>(() => undefined);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(NotificationService);
  const tokenProvider = inject(TOKEN_PROVIDER, { optional: true });

  // Add authorization header if token is available
  let modifiedReq = req;
  const token = tokenProvider?.getToken();
  if (token) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(modifiedReq).pipe(
    // Retries the request up to 2 times on failure with a 1-second delay.
    retry({ count: 2, delay: 1000 }),
    // Use the `map` operator to handle successful responses.
    map((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        return handleSuccessResponse(event, toastr, req);
      }
      return event;
    }),
    // Use the `catchError` operator to handle any errors that occur.
    catchError((error: HttpErrorResponse) => handleErrorResponse(error, toastr)),
  );
};

// --- Helper Functions ---

/**
 * Handles successful HTTP responses, standardizes them, shows notifications, and transforms for consumers.
 */
function handleSuccessResponse(
  event: HttpResponse<unknown>,
  notificationService: NotificationService,
  req: HttpRequest<unknown>,
): HttpResponse<unknown> {
  const body = event.body;

  // Standardize the response to always have ApiResponse structure
  const standardizedResponse = standardizeApiResponse(body);

  // Handle toast notifications based on standardized response
  handleToastNotifications(standardizedResponse, notificationService, req);

  // Return the appropriate data based on response type
  return transformResponseForConsumers(standardizedResponse, event);
}

/**
 * Handles HTTP errors (from the interceptor chain, not backend ApiResponse).
 */
function handleErrorResponse(error: HttpErrorResponse, notificationService: NotificationService) {
  const status = error.status;

  // Only show notifications for critical HTTP-level errors.
  // We avoid showing toasts for 4xx errors, which are handled by the component.
  if (status !== null && shouldShowCriticalErrorNotification(status)) {
    const message = getCriticalErrorMessage(error);
    const title = getErrorTitle(status);

    notificationService.error({
      message: message,
      title: title,
      config: { duration: 5000 },
    });
  }

  // Always re-throw the error so components/services can handle it.
  return throwError(() => error);
}

/**
 * Standardizes any response to follow the ApiResponse structure
 */
function standardizeApiResponse(body: unknown): ApiResponse<unknown> {
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
 * Handles toast notifications based on standardized response
 */
function handleToastNotifications(
  response: ApiResponse<unknown>,
  notificationService: NotificationService,
  req: HttpRequest<unknown>,
): void {
  const shouldShowToast = shouldShowSuccessToast(req);
  const forceShow = req.context.get(SHOW_NOTIFICATIONS);
  const skipNotification = req.context.get(SKIP_NOTIFICATION);

  // Determine if we should show notifications, considering overrides
  const showNotifications = forceShow !== undefined ? forceShow : shouldShowToast;

  if (skipNotification) return;

  // Dynamic handling: Use show() for runtime type selection
  if (response.message && showNotifications && ['success', 'warning', 'error'].includes(response.status)) {
    notificationService.show({
      type: response.status as 'success' | 'warning' | 'error',
      message: response.message,
    });
  }

  // Handle warnings separately if needed
  if (response.status === 'warning' && response.warnings && response.warnings.length > 0) {
    response.warnings.forEach(warning => {
      notificationService.show({
        type: 'warning',
        message: warning.message,
      });
    });
  }

  // Handle errors separately if needed
  if (response.status === 'error' && response.errors && response.errors.length > 0) {
    response.errors.forEach(error => {
      notificationService.show({
        type: 'error',
        message: error.message,
      });
    });
  }
}

/**
 * Transforms the standardized response for consumers
 */
function transformResponseForConsumers(
  response: ApiResponse<unknown>,
  originalEvent: HttpResponse<unknown>,
): HttpResponse<unknown> {
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
 * Checks if a response is a valid ApiResponse
 */
function isValidApiResponse(response: unknown): response is ApiResponse<unknown> {
  if (response === null || typeof response !== 'object') return false;
  const r = response as Record<string, unknown>;
  return (
    'status' in r &&
    'code' in r &&
    typeof r['status'] === 'string' &&
    ['success', 'error', 'warning'].includes(r['status'])
  );
}

/**
 * Determines whether to show success toast notifications based on the request type.
 */
function shouldShowSuccessToast(req: HttpRequest<unknown>): boolean {
  const url = req.url?.toLowerCase() || '';
  const method = req.method?.toLowerCase() || '';

  // Never show for these cases
  const excludedPatterns = [
    'get',
    '/list',
    '/search',
    '/query',
    '/page',
    '/paginated',
    '/health',
    '/status',
    '/ping',
  ];

  if (excludedPatterns.some(pattern => method === pattern || url.includes(pattern))) {
    return false;
  }

  // Always show for these methods
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    return true;
  }

  // Default behavior
  return method !== 'get';
}

/**
 * Determines if we should show a notification for this HTTP error.
 */
function shouldShowCriticalErrorNotification(status: number): boolean {
  // Show notifications for:
  // - Network errors (status 0)
  // - Server errors (5xx)
  return status === 0 || (status >= 500 && status < 600);
}

/**
 * Gets the appropriate title for error notifications.
 */
function getErrorTitle(status: number): string {
  if (status === 0) return 'Connection Error';
  if (status >= 500) return 'Server Error';
  return 'Error';
}

/**
 * Gets the appropriate message for critical errors.
 */
function getCriticalErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to connect to the server. Please check your network connection.';
  }

  if (error.status >= 500) {
    return (
      error.error?.message || error.message || 'A server error occurred. Please try again later.'
    );
  }

  return error.error?.message || error.message || 'An unexpected error occurred';
}
