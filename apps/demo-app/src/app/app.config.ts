import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { initHttpFactory } from './init-http-factory';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './providers';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  ENVIRONMENT,
  apiInterceptor,
  httpContextInterceptor,
  provideCoreConfig,
  createCoreConfig,
  provideHttpContext,
} from '@acontplus/ng-core';

import { spinnerInterceptor } from '@acontplus/ng-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
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
    provideRouter(appRoutes),
    { provide: ENVIRONMENT, useValue: environment },
    provideHttpContext({
      includeAuthToken: false,
    }),
  ],
};
