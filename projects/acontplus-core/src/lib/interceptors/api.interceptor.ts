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
        return handleSuccessResponse(event, toastr);
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
): HttpResponse<any> {
  const body = event.body;

  if (body?.status === 'warning') {
    const message = body.message || body.details || 'Warning occurred';
    toastr.warning({ message });
  }

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
