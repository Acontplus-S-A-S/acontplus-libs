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
    catchError((error: HttpErrorResponse) =>
      handleErrorResponse(error, toastr),
    ),
  );
};

function handleSuccessResponse(
  event: HttpResponse<any>,
  toastr: ToastrNotificationService,
  req: any,
): HttpResponse<any> {
  const body = event.body;

  // Handle warning status
  if (body?.status === 'warning') {
    const message = body.message || body.details || 'Warning occurred';
    toastr.warning({ message });
  }

  // Handle success status
  if (body?.status === 'success') {
    const message = body.message;
    const shouldShowToast = shouldShowSuccessToast(req, body);

    // Only show success toast if it's not a list/query operation or if explicitly requested
    if (message && shouldShowToast) {
      toastr.success({ message });
    }

    // If data exists, return the data (for operations that return entities)
    if (body.data !== undefined && body.data !== null) {
      return event.clone({ body: body.data });
    }

    // If no data but has message, return the full response for context
    // This allows the calling code to access metadata, correlationId, etc.
    if (message) {
      return event.clone({ body: body });
    }

    // If just success status with no data and no message, return the body as is
    return event.clone({ body: body });
  }

  // For non-standard responses or responses without status, return as is
  return event.clone({ body: body.data ?? body });
}

function handleErrorResponse(
  error: HttpErrorResponse,
  toastr: ToastrNotificationService,
) {
  const apiError = error.error;

  if (apiError?.status === 'error') {
    const primaryError = apiError.errors?.[0] || apiError;
    const message =
      primaryError.message || primaryError.details || 'Error occurred';
    toastr.error({ message });
  } else {
    const message = error.message || 'Network error occurred';
    toastr.error({ message });
  }

  return throwError(() => apiError ?? error);
}

/**
 * Determines whether to show success toast notifications based on the request type
 * and response content.
 */
function shouldShowSuccessToast(req: any, response: any): boolean {
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
  // These are typically commands that modify data
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    return true;
  }

  // Default: show for non-GET requests, don't show for GET requests
  return method !== 'get';
}
