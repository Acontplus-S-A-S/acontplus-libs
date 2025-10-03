import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthTokens } from '@acontplus/core';
import { ENVIRONMENT } from '@acontplus/ng-config';

@Injectable({
  providedIn: 'root',
})
export class TokenRepository {
  private environment = inject(ENVIRONMENT);
  private platformId = inject(PLATFORM_ID);

  saveTokens(tokens: AuthTokens, rememberMe = false): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setToken(tokens.token, rememberMe);
      this.setRefreshToken(tokens.refreshToken, rememberMe);
    }
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return (
      localStorage.getItem(this.environment.tokenKey) ||
      sessionStorage.getItem(this.environment.tokenKey)
    );
  }

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return (
      localStorage.getItem(this.environment.refreshTokenKey) ||
      sessionStorage.getItem(this.environment.refreshTokenKey)
    );
  }

  setToken(token: string, rememberMe = false): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (rememberMe) {
      localStorage.setItem(this.environment.tokenKey, token);
    } else {
      sessionStorage.setItem(this.environment.tokenKey, token);
    }
  }

  setRefreshToken(refreshToken: string, rememberMe = false): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (rememberMe) {
      localStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    } else {
      sessionStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    }
  }

  clearTokens(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.removeItem(this.environment.tokenKey);
    localStorage.removeItem(this.environment.refreshTokenKey);
    sessionStorage.removeItem(this.environment.tokenKey);
    sessionStorage.removeItem(this.environment.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return false;
    }

    try {
      const decodedAccessToken = jwtDecode(accessToken);
      const accessExpiration = Number(decodedAccessToken.exp);
      const currentTimeUTC = Math.floor(Date.now() / 1000);

      return accessExpiration > currentTimeUTC;
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

  /**
   * Determines if tokens are stored persistently (localStorage) vs session (sessionStorage)
   */
  isRememberMeEnabled(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Check if tokens exist in localStorage (persistent storage)
    const tokenInLocalStorage = localStorage.getItem(this.environment.tokenKey);
    const refreshTokenInLocalStorage = localStorage.getItem(this.environment.refreshTokenKey);

    return !!(tokenInLocalStorage || refreshTokenInLocalStorage);
  }
}
