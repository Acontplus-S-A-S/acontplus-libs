import {
  HttpContext,
  HttpContextToken,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { OverlayService } from '../services';
/**
 * Token to determine if a request should show spinner
 * Default is true (show spinner for all requests)
 */
const SHOW_SPINNER = new HttpContextToken<boolean>(() => true);

const requests: HttpRequest<any>[] = [];

/**
 * Helper function to disable spinner for specific requests
 * @returns HttpContext with spinner disabled
 */
export function withoutSpinner() {
  return new HttpContext().set(SHOW_SPINNER, false);
}

/**
 * Service to track active HTTP requests
 */
@Injectable({
  providedIn: 'root',
})
export class ActiveRequestsTracker {
  get count(): number {
    return requests.length;
  }

  add(request: HttpRequest<any>): void {
    requests.push(request);
  }

  remove(request: HttpRequest<any>): void {
    const index = requests.indexOf(request);
    if (index >= 0) {
      requests.splice(index, 1);
    }
  }
}

/**
 * Interceptor that shows/hides a loading spinner based on active HTTP requests
 */
export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  // Track active requests requiring spinner
  console.log(requests);
  const activeRequests = inject(ActiveRequestsTracker);
  const overlayService = inject(OverlayService);

  // Skip spinner if disabled for this request
  if (!req.context.get(SHOW_SPINNER)) {
    return next(req);
  }

  // Add request to tracking
  activeRequests.add(req);

  // Show spinner if this is the first active request
  if (activeRequests.count === 1) {
    overlayService.showSpinner();
  }

  return next(req).pipe(
    finalize(() => {
      // Remove request and hide spinner if no more active requests
      activeRequests.remove(req);
      if (activeRequests.count === 0) {
        overlayService.hideSpinner();
      }
    }),
  );
};
