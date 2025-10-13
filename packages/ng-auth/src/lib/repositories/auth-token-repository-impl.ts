import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthTokens, UserData } from '@acontplus/core';
import { AuthTokenRepository, ENVIRONMENT } from '@acontplus/ng-config';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenRepositoryImpl implements AuthTokenRepository {
  private environment = inject(ENVIRONMENT);
  private platformId = inject(PLATFORM_ID);

  saveTokens(tokens: AuthTokens, rememberMe = false): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setToken(tokens.token, rememberMe);
      this.setRefreshToken(tokens.refreshToken, rememberMe);
    }
  }

  getToken(): string | null {
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
    const accessToken = this.getToken();

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
    const accessToken = this.getToken();
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

  getTokenPayload(): unknown {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
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

  getUserData(): UserData | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decodedToken = jwtDecode<Record<string, unknown>>(token);

      const email =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
        decodedToken['email'] ??
        decodedToken['sub'] ??
        decodedToken['user_id'];

      const displayName =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ??
        decodedToken['displayName'] ??
        decodedToken['display_name'] ??
        decodedToken['name'] ??
        decodedToken['given_name'];

      const name = decodedToken['name'] ?? displayName;

      if (!email) {
        return null;
      }

      const userData: UserData = {
        email: email.toString(),
        displayName: displayName?.toString() ?? 'Unknown User',
        name: name?.toString(),
        roles: this.extractArrayField(decodedToken, ['roles', 'role']),
        permissions: this.extractArrayField(decodedToken, ['permissions', 'perms']),
        tenantId:
          decodedToken['tenantId']?.toString() ??
          decodedToken['tenant_id']?.toString() ??
          decodedToken['tenant']?.toString(),
        companyId:
          decodedToken['companyId']?.toString() ??
          decodedToken['company_id']?.toString() ??
          decodedToken['organizationId']?.toString() ??
          decodedToken['org_id']?.toString(),
        locale: decodedToken['locale']?.toString(),
        timezone: decodedToken['timezone']?.toString() ?? decodedToken['tz']?.toString(),
      };

      return userData;
    } catch {
      return null;
    }
  }

  /**
   * Extract array field from decoded token, trying multiple possible field names
   */
  private extractArrayField(
    decodedToken: Record<string, unknown>,
    fieldNames: string[],
  ): string[] | undefined {
    for (const fieldName of fieldNames) {
      const value = decodedToken[fieldName];
      if (Array.isArray(value)) {
        return value.map(v => v.toString());
      }
      if (typeof value === 'string') {
        // Handle comma-separated string values
        return value
          .split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
      }
    }
    return undefined;
  }
}
