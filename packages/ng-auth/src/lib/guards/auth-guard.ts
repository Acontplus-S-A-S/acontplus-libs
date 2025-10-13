import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenRepositoryImpl } from '../repositories/auth-token-repository-impl';
import { AuthUrlRedirect } from '../services/auth-url-redirect';
import { ENVIRONMENT } from '@acontplus/ng-config';

export const authGuard: CanActivateFn = (_route, state) => {
  const tokenRepository = inject(AuthTokenRepositoryImpl);
  const router = inject(Router);
  const urlRedirectService = inject(AuthUrlRedirect);
  const environment = inject(ENVIRONMENT);

  if (tokenRepository.isAuthenticated()) {
    return true;
  }

  // Store the current URL for redirection after login
  urlRedirectService.storeIntendedUrl(state.url);

  // Redirect to login page (configurable via environment)
  router.navigate([`/${environment.loginRoute}`]);
  return false;
};
