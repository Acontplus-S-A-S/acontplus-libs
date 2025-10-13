import { Provider } from '@angular/core';
import { AuthTokenRepositoryImpl } from '../repositories/auth-token-repository-impl';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { AuthHttpRepository } from '../data/repositories/auth-http-repository';
import { AUTH_TOKEN } from '@acontplus/ng-config';

export const authProviders: Provider[] = [
  {
    provide: AuthRepository,
    useClass: AuthHttpRepository,
  },
  {
    provide: AUTH_TOKEN,
    useClass: AuthTokenRepositoryImpl,
  },
];
