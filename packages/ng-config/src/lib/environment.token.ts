import { InjectionToken } from '@angular/core';
import { Environment } from '@acontplus/core';

/**
 * @const ENVIRONMENT
 * Injection token for the environment interface to be provided by the applications.
 */
export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  factory: () => ({
    isProduction: false,
    apiBaseUrl: 'http://localhost:3000/api',
    tokenKey: 'access_token',
    refreshTokenKey: 'refresh_token',
    clientId: 'local-dev',
    loginRoute: '/auth',
  }),
});
