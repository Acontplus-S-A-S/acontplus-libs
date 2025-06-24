import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslocoHttpLoader } from './transloco-loader';

import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { environment } from '../environments/environment';
import {
  ENVIRONMENT,
  errorInterceptor,
  injectSessionInterceptor,
} from '@acontplus-utils';
import { spinnerInterceptor } from '@acontplus-ui-components';
import { provideTransloco } from '@jsverse/transloco';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        spinnerInterceptor,
        injectSessionInterceptor,
      ]),
    ),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'es',
        reRenderOnLangChange: true,
        missingHandler: {
          useFallbackTranslation: true,
        },
      },
      loader: TranslocoHttpLoader,
    }),

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
