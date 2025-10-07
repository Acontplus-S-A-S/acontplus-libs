import { InjectionToken } from '@angular/core';
import { UserData } from '@acontplus/core';

export interface ITokenProvider {
  getToken(): string | null;
  isAuthenticated(): boolean;
  getRefreshToken?(): string | null;
  getUserData(): UserData | null;
}

export const TOKEN_PROVIDER = new InjectionToken<ITokenProvider>('TOKEN_PROVIDER');
