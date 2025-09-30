import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenRepository } from '../repositories/token.repository';
import { ENVIRONMENT } from '../environments';

export const authGuard: CanActivateFn = (_route, _state) => {
  const tokenRepository = inject(TokenRepository);
  const router = inject(Router);
  const environment = inject(ENVIRONMENT);

  if (tokenRepository.isAuthenticated()) {
    return true;
  }

  // Redirect to login page (configurable via environment)
  router.navigate([environment.loginRoute]);
  return false;
};
