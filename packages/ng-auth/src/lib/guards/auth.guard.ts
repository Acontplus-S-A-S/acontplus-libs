import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/auth-token.service';
import { ENVIRONMENT } from '@acontplus/ng-config';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthTokenService);
  const router = inject(Router);
  const environment = inject(ENVIRONMENT);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page (configurable via environment)
  router.navigate([environment.loginRoute]);
  return false;
};
