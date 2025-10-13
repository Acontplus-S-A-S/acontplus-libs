import { InjectionToken } from '@angular/core';
import { AuthTokenRepository } from '../repositories';

export const AUTH_TOKEN = new InjectionToken<AuthTokenRepository>('AUTH_TOKEN_PROVIDER');
