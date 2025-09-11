import {
  ApplicationConfig,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslocoHttpLoader } from './providers/transloco-loader';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { environment } from '../environments/environment';
import {
  ENVIRONMENT,
  apiInterceptor,
  httpContextInterceptor,
  provideCoreConfig,
  createCoreConfig,
} from '@acontplus-core';
import { spinnerInterceptor } from '@acontplus-ui-components';
import { provideTransloco } from '@jsverse/transloco';

import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpContext } from '../../../acontplus-core/src/lib/interceptors';
import { initHttpFactory } from './init-http-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core configuration
    provideCoreConfig(
      createCoreConfig({
        apiBaseUrl: environment.apiBaseUrl,
        enableCorrelationTracking: true,
        enableRequestLogging: !environment.isProduction,
        enableErrorLogging: true,
        customHeaders: {
          'Client-Version': '1.0.0',
          'Client-Id': 'test-app',
        },
        excludeUrls: ['/health', '/metrics'],
      }),
    ),
    provideAppInitializer(initHttpFactory()),

    provideHttpClient(
      withInterceptors([apiInterceptor, spinnerInterceptor, httpContextInterceptor]),
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

    provideToastr(),
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ENVIRONMENT, useValue: environment },
    provideHttpContext({
      includeAuthToken: false,
    }),
  ],
};
