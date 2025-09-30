// src/lib/providers/auth.providers.ts
import { Provider } from '@angular/core';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { AuthHttpRepository } from '../data/repositories/auth-http.repository';

export const authProviders: Provider[] = [
  {
    provide: AuthRepository,
    useClass: AuthHttpRepository,
  },
];
