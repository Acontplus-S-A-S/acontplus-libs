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
import { BaseRepository } from '../../../acontplus-core/src/lib/repositories';
import { UserRepository } from './user.repository';
import { CreateUserCommand } from './commands/create-user.command';
import { GetUsersQuery } from './queries/user.query';

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

    { provide: BaseRepository, UseClass: UserRepository },
  ],
};
