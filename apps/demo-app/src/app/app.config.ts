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
import { ENVIRONMENT } from '@acontplus/ng-config';
import {
  apiInterceptor,
  httpContextInterceptor,
  spinnerInterceptor,
  TOKEN_PROVIDER,
} from '@acontplus/ng-infrastructure';
import { AuthTokenService } from '@acontplus/ng-auth';
import { provideNotifications } from '../../../../packages/ng-notifications/src/lib/providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAppInitializer(initHttpFactory()),

    provideHttpClient(
      withInterceptors([apiInterceptor, spinnerInterceptor, httpContextInterceptor]),
    ),
    { provide: TOKEN_PROVIDER, useClass: AuthTokenService },
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
    provideNotifications(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
