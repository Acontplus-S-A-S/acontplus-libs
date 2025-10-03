import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { UrlRedirectService } from '../services/url-redirect.service';
import { ENVIRONMENT } from '@acontplus/ng-config';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthTokenService);
  const router = inject(Router);
  const urlRedirectService = inject(UrlRedirectService);
  const environment = inject(ENVIRONMENT);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the current URL for redirection after login
  urlRedirectService.storeIntendedUrl(state.url);

  // Redirect to login page (configurable via environment)
  router.navigate([environment.loginRoute]);
  return false;
};
