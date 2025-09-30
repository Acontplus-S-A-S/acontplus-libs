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
    // Refresh tokens are now stored in HttpOnly cookies by the server
    // We can't read them directly from client-side code for security
    // They are automatically sent with requests when withCredentials: true is used
    return null;
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

  setRefreshToken(_refreshToken: string, _rememberMe = false): void {
    // Refresh tokens are now set by the server as HttpOnly cookies
    // Client-side code cannot set HttpOnly cookies for security reasons
    // They are set in response to successful login/register requests
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
}
