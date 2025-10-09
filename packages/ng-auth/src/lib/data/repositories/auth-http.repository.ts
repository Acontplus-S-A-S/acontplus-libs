// src/lib/data/repositories/auth-http.repository.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginRequest, RegisterRequest, RefreshTokenRequest } from '../../domain/models/auth';
import { AuthTokens } from '@acontplus/core';
import { AUTH_API } from '@acontplus/ng-config';

function getDeviceInfo(): string {
  return `${navigator.platform ?? 'Unknown'} - ${navigator.userAgent}`;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly URL = `${AUTH_API.AUTH}`;

  login(request: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.URL}login`, request, {
      headers: {
        'Device-Info': getDeviceInfo(),
      },
      withCredentials: true,
    });
  }

  register(request: RegisterRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.URL}register`, request, {
      headers: {
        'Device-Info': getDeviceInfo(),
      },
      withCredentials: true,
    });
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.URL}refresh`, request, {
      headers: {
        'Device-Info': getDeviceInfo(),
      },
      withCredentials: true,
    });
  }

  logout(email: string, refreshToken: string): Observable<void> {
    return this.http.post<void>(
      `${this.URL}logout`,
      { email, refreshToken: refreshToken || undefined },
      {
        headers: {},
        withCredentials: true, // Ensure cookies are sent
      },
    );
  }
}
