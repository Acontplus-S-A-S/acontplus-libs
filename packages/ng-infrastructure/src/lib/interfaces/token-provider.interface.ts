import { InjectionToken } from '@angular/core';

export interface ITokenProvider {
  getToken(): string | null;
  isAuthenticated(): boolean;
}

export const TOKEN_PROVIDER = new InjectionToken<ITokenProvider>('TOKEN_PROVIDER');
