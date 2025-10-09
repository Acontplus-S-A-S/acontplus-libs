import { HttpInterceptorFn, HttpRequest, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CsrfService } from '../services/csrf.service';

// A token to use with HttpContext for skipping CSRF token addition on specific requests.
export const SKIP_CSRF = new HttpContextToken<boolean>(() => false);

/**
 * HTTP interceptor that automatically adds CSRF tokens to state-changing requests
 * Only applies to requests to the same origin to avoid leaking tokens to external APIs
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfService = inject(CsrfService);

  // Check if CSRF should be skipped for this request
  const skipCsrf = req.context.get(SKIP_CSRF);
  if (skipCsrf) {
    return next(req);
  }

  // Only add CSRF token to state-changing requests (POST, PUT, PATCH, DELETE)
  const isStateChangingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    req.method.toUpperCase(),
  );

  // Only add CSRF token to same-origin requests
  const isSameOrigin = isRequestToSameOrigin(req);

  if (isStateChangingMethod && isSameOrigin) {
    return from(csrfService.getCsrfToken()).pipe(
      switchMap(csrfToken => {
        const modifiedReq = req.clone({
          setHeaders: {
            'X-CSRF-Token': csrfToken,
          },
        });
        return next(modifiedReq);
      }),
    );
  }

  // For non-state-changing requests or external requests, proceed without modification
  return next(req);
};

/**
 * Checks if the request is going to the same origin as the current application
 */
function isRequestToSameOrigin(req: HttpRequest<unknown>): boolean {
  try {
    const requestUrl = new URL(req.url, window.location.origin);
    return requestUrl.origin === window.location.origin;
  } catch {
    // If URL parsing fails, assume it's not same origin for security
    return false;
  }
}
