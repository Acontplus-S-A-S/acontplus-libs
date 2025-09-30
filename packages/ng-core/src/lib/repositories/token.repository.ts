import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ENVIRONMENT } from '../environments';
import { AuthTokens } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class TokenRepository {
  private environment = inject(ENVIRONMENT);

  saveTokens(tokens: AuthTokens, rememberMe = false): void {
    this.setToken(tokens.token, rememberMe);
    this.setRefreshToken(tokens.refreshToken, rememberMe);
  }

  getAccessToken(): string | null {
    return (
      localStorage.getItem(this.environment.tokenKey) ||
      sessionStorage.getItem(this.environment.tokenKey)
    );
  }

  getRefreshToken(): string | null {
    return (
      localStorage.getItem(this.environment.refreshTokenKey) ||
      sessionStorage.getItem(this.environment.refreshTokenKey)
    );
  }

  setToken(token: string, rememberMe = false): void {
    if (rememberMe) {
      localStorage.setItem(this.environment.tokenKey, token);
    } else {
      sessionStorage.setItem(this.environment.tokenKey, token);
    }
  }

  setRefreshToken(refreshToken: string, rememberMe = false): void {
    if (rememberMe) {
      localStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    } else {
      sessionStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.environment.tokenKey);
    localStorage.removeItem(this.environment.refreshTokenKey);
    sessionStorage.removeItem(this.environment.tokenKey);
    sessionStorage.removeItem(this.environment.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    try {
      const decodedAccessToken = jwtDecode(accessToken);
      const accessExpiration = Number(decodedAccessToken.exp);
      const currentTimeUTC = Math.floor(Date.now() / 1000);

      if (accessExpiration > currentTimeUTC) {
        return true;
      }

      return this.isRefreshTokenValid();
    } catch {
      return false;
    }
  }

  private isRefreshTokenValid(): boolean {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      return true; // Backend validates expiration
    } catch {
      return false;
    }
  }

  needsRefresh(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      const expiration = Number(decodedToken.exp);
      const currentTimeUTC = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiration - currentTimeUTC;

      return timeUntilExpiry <= 300; // 5 minutes
    } catch {
      return false;
    }
  }

  getTokenPayload(): any {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
}
