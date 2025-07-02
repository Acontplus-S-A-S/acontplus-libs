// api.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@jsverse/transloco';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

type ApiTranslationKey =
  | `api.errors.${string}`
  | `api.warnings.${string}`
  | 'api.errors.default'
  | 'api.warnings.default'
  | 'api.errors.network';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const transloco = inject(TranslocoService, { optional: true });

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        return handleSuccessResponse(event, toastr, transloco);
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) =>
      handleErrorResponse(error, toastr, transloco),
    ),
  );
};

function handleSuccessResponse(
  event: HttpResponse<any>,
  toastr: ToastrService,
  transloco?: TranslocoService | null,
): HttpResponse<any> {
  const body = event.body;

  if (body?.status === 'warning') {
    const translationKey = body.code
      ? (`api.warnings.${body.code}` as const)
      : 'api.warnings.default';

    const message = getTranslatedMessage(
      transloco,
      translationKey,
      body.message,
      body.details,
    );

    toastr.warning(message);
  }

  return event.clone({ body: body.data ?? body });
}

function handleErrorResponse(
  error: HttpErrorResponse,
  toastr: ToastrService,
  transloco?: TranslocoService | null,
) {
  const apiError = error.error;

  if (apiError?.status === 'error') {
    const primaryError = apiError.errors?.[0] || apiError;
    const translationKey = primaryError.code
      ? (`api.errors.${primaryError.code}` as const)
      : 'api.errors.default';

    const message = getTranslatedMessage(
      transloco,
      translationKey,
      primaryError.message,
      primaryError.details,
    );

    toastr.error(message);
  } else {
    const message = getTranslatedMessage(
      transloco,
      'api.errors.network',
      error.message,
    );
    toastr.error(message);
  }

  return throwError(() => apiError ?? error);
}

function getTranslatedMessage(
  transloco: TranslocoService | null | undefined,
  key: ApiTranslationKey,
  fallback?: string,
  params?: Record<string, unknown>,
): string {
  if (!transloco) return fallback || key;

  const translation = transloco.translate(key, params);
  return translation !== key ? translation : fallback || key;
}
