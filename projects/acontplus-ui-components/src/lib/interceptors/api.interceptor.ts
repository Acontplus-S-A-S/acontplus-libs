import {
  HttpInterceptorFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
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
  toastr: ToastrService,
): HttpResponse<any> {
  const body = event.body;

  if (body?.status === 'warning') {
    toastr.warning(body.message || 'Operation completed with warnings');
  }

  return event.clone({ body: body.data ?? body });
}

function handleErrorResponse(error: HttpErrorResponse, toastr: ToastrService) {
  const apiError = error.error;

  if (apiError?.status === 'error') {
    const errorMessage = apiError.errors?.length
      ? apiError.errors.map((e: any) => e.message).join('\n')
      : apiError.message || 'An error occurred';
    toastr.error(errorMessage);
  } else {
    toastr.error(error.message || 'An unexpected error occurred');
  }

  return throwError(() => apiError ?? error);
}
