import {
  HttpInterceptorFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpRequest,
  HttpContext,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiResponse } from '@acontplus/core';
import { NotificationService } from '@acontplus/ng-notifications';

// A token to use with HttpContext for skipping notifications on specific requests.
export const SKIP_NOTIFICATION = new HttpContextToken<boolean>(() => false);

// A token to use with HttpContext for forcing notifications on specific requests (overrides exclusion patterns).
export const SHOW_NOTIFICATIONS = new HttpContextToken<boolean | undefined>(() => undefined);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(NotificationService);

  return next(req).pipe(
    // Retries the request up to 2 times on failure with a 1-second delay.
    retry({ count: 2, delay: 1000 }),
    // Use the `map` operator to handle successful responses.
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        handleSuccessResponse(event, toastr, req);
      }
      return event;
    }),
    // Use the `catchError` operator to handle any errors that occur.
    catchError((error: HttpErrorResponse) => handleErrorResponse(error, toastr)),
  );
};

// --- Helper Functions ---

/**
 * Handles successful HTTP responses and shows notifications.
 */
function handleSuccessResponse(
  event: HttpResponse<any>,
  notificationService: NotificationService,
  req: HttpRequest<any>,
): void {
  const response = event.body as ApiResponse<any>;

  if (!response) return;

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

/**
 * Determines whether to show success toast notifications based on the request type.
 */
function shouldShowSuccessToast(req: HttpRequest<any>): boolean {
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
