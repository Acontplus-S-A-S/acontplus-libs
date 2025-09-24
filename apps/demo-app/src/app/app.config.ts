import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
<<<<<<< HEAD:projects/test-app/src/app/app.config.ts
  provideZonelessChangeDetection,
=======
  provideZoneChangeDetection,
>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:apps/demo-app/src/app/app.config.ts
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

<<<<<<< HEAD:projects/test-app/src/app/app.config.ts
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpContext } from '../../../acontplus-core/src/lib/interceptors';
import { initHttpFactory } from './init-http-factory';
=======
import { spinnerInterceptor } from '@acontplus/ng-components';
import { provideNotifications } from '../../../../packages/ng-notifications/src/lib/providers';
>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:apps/demo-app/src/app/app.config.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
<<<<<<< HEAD:projects/test-app/src/app/app.config.ts
    provideZonelessChangeDetection(),
    // Core configuration
=======
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:apps/demo-app/src/app/app.config.ts
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
<<<<<<< HEAD:projects/test-app/src/app/app.config.ts
    provideRouter(routes),
=======
    provideNotifications(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:apps/demo-app/src/app/app.config.ts
    { provide: ENVIRONMENT, useValue: environment },
    provideHttpContext({
      includeAuthToken: false,
    }),
  ],
};
