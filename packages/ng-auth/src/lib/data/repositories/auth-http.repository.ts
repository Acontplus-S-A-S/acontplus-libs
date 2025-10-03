// src/lib/data/repositories/auth-http.repository.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginRequest, RegisterRequest, RefreshTokenRequest, RegisterResponse, User } from '../../domain/models/user';
import { AuthTokens } from '@acontplus/core';
import { AUTH_API } from '@acontplus/ng-config';
import { CsrfService } from '../../services/csrf.service';

function getDeviceInfo(): string {
  return `${navigator.platform ?? 'Unknown'} - ${navigator.userAgent}`;
}

@Injectable({
  providedIn: 'root',
})
export class AuthHttpRepository extends AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly csrfService = inject(CsrfService);
  private readonly URL = `${AUTH_API.ACCOUNT}`;

  login(request: LoginRequest): Observable<AuthTokens> {
    return from(this.csrfService.getCsrfToken()).pipe(
      switchMap(csrfToken =>
        this.http.post<AuthTokens>(`${this.URL}login`, request, {
          headers: {
            'Device-Info': getDeviceInfo(),
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true,
        })
      )
    );
  }

  register(request: RegisterRequest): Observable<AuthTokens> {
    return from(this.csrfService.getCsrfToken()).pipe(
      switchMap(csrfToken =>
        this.http
          .post<RegisterResponse>(`${this.URL}register`, request, {
            headers: {
              'Device-Info': getDeviceInfo(),
              'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
          })
          .pipe(
            map(response => new AuthTokens(response.token, response.refreshToken)),
          )
      )
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<AuthTokens> {
    return from(this.csrfService.getCsrfToken()).pipe(
      switchMap(csrfToken =>
        this.http
          .post<AuthTokens>(`${this.URL}refresh`, request, {
            headers: {
              'Device-Info': getDeviceInfo(),
              'X-CSRF-Token': csrfToken,
            },
            withCredentials: true,
          })
          .pipe(map(response => new AuthTokens(response.token, response.refreshToken)))
      )
    );
  }

  logout(email: string, refreshToken: string): Observable<void> {
    return from(this.csrfService.getCsrfToken()).pipe(
      switchMap(csrfToken =>
        this.http.post<void>(`${this.URL}logout`, { email, refreshToken: refreshToken || undefined }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true, // Ensure cookies are sent
        })
      )
    );
  }
}
