import { UserData } from '@acontplus/core';

export interface AuthTokenRepository {
  getToken(): string | null;
  isAuthenticated(): boolean;
  getRefreshToken?(): string | null;
  getUserData(): UserData | null;
}
