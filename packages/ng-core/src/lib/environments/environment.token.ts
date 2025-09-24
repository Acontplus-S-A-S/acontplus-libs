import { InjectionToken } from '@angular/core';
import { Environment } from '@acontplus/core';

/**
 * @const ENVIRONMENT
 * Injection token for the environment interface to be provided by the applications.
 */
export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  factory: () => ({
    apiBaseUrl: '',
    isProduction: false,
    tokenKey: 'auth-token',
    refreshTokenKey: 'refresh-token',
    clientId: 'default-client',
  }),
});
