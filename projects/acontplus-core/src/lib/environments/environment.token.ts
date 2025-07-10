import { InjectionToken } from '@angular/core';

import { Environment } from './environment';

/**
 * @const ENVIRONMENT
 * Injection token for the environment interface to be provided by the applications.
 */
export const ENVIRONMENT: InjectionToken<Environment> = new InjectionToken(
  'ENVIRONMENT',
  {
    factory: () => ({
      apiBaseUrl: '',
      isProduction: false,
      tokenKey: 'auth-token',
      refreshTokenKey: 'refresh-token',
      clientId: 'default-client',
    }),
  },
);
