import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
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
  provideRepositoryRegistrations,
  createRepositoryRegistration,
} from '@acontplus-core';
import { spinnerInterceptor } from '@acontplus-ui-components';
import { provideTransloco } from '@jsverse/transloco';
import { UserHttpRepository } from './data/user-http.repository';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpContext } from '../../../acontplus-core/src/lib/interceptors';

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

    // Repository registrations
    provideRepositoryRegistrations([
      createRepositoryRegistration('user', UserHttpRepository, 'users', '/api/users'),
    ]),

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
