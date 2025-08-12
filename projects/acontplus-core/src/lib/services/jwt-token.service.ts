import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ENVIRONMENT } from '../environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {
  private environment = inject(ENVIRONMENT);
  private router = inject(Router);

  getToken(): string | null {
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

  setToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(this.environment.tokenKey, token);
    } else {
      sessionStorage.setItem(this.environment.tokenKey, token);
    }
  }

  setRefreshToken(refreshToken: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    } else {
      sessionStorage.setItem(this.environment.refreshTokenKey, refreshToken);
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.environment.tokenKey);
    localStorage.removeItem(this.environment.refreshTokenKey);
    sessionStorage.removeItem(this.environment.tokenKey);
    sessionStorage.removeItem(this.environment.refreshTokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (error) {
      return false;
    }
  }

  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  handleUnauthorized(): void {
    console.error('Unauthorized access - token expired or invalid');
    this.removeTokens();
    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    const payload = this.getTokenPayload();
    return payload?.sub || payload?.userId || null;
  }

  getUserRoles(): string[] {
    const payload = this.getTokenPayload();
    return payload?.roles || payload?.authorities || [];
  }

  getTenantFromToken(): string | null {
    const payload = this.getTokenPayload();
    return payload?.tenantId || payload?.tenant || null;
  }
}
