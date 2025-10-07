import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UrlRedirectService } from '../services/url-redirect.service';
import { TokenRepository } from '../repositories/token.repository';
import { ENVIRONMENT } from '@acontplus/ng-config';

/**
 * Interceptor that handles authentication errors and manages URL redirection
 * Captures the current URL when a 401 error occurs and redirects to login
 */
export const authRedirectInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const urlRedirectService = inject(UrlRedirectService);
  const tokenRepository = inject(TokenRepository);
  const environment = inject(ENVIRONMENT);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401) {
        // Only store and redirect if user was previously authenticated
        // This prevents redirect loops and handles session expiry scenarios
        if (tokenRepository.isAuthenticated()) {
          // Store the current URL for redirection after re-authentication
          urlRedirectService.storeCurrentUrlIfAllowed();

          // Navigate to login page
          router.navigate([`/${environment.loginRoute}`]);
        }
      }

      // Re-throw the error so other error handlers can process it
      return throwError(() => error);
    }),
  );
};
