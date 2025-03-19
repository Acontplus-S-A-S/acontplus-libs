import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { environment } from '../environments/environment';
import {
  ENVIRONMENT,
  errorInterceptor,
  injectSessionInterceptor,
  spinnerInterceptor,
} from 'acontplus-utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        spinnerInterceptor,
        injectSessionInterceptor,
      ]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
