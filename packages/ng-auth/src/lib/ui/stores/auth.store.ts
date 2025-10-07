// src/lib/presentation/stores/auth.store.ts
import { Injectable, inject, signal, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { TokenRepository } from '../../repositories/token.repository';
import { UserRepository } from '@acontplus/ng-infrastructure';
import { AuthTokens, UserData, DecodedToken } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStore implements OnDestroy {
  private readonly authRepository = inject(AuthRepository);
  private readonly tokenRepository = inject(TokenRepository);
  private readonly userRepository = inject(UserRepository);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  // Authentication state signals
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _user = signal<UserData | null>(null);

  // Public readonly signals
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly user = this._user.asReadonly();

  // Private refresh token timeout (instead of interval)
  private refreshTokenTimeout?: number;
  private refreshInProgress$?: Observable<AuthTokens | null>;

  constructor() {
    this.initializeAuthentication();
  }

  /**
   * Initialize authentication state on app startup
   */
  private initializeAuthentication(): void {
    this._isLoading.set(true);

    try {
      const isAuthenticated = this.tokenRepository.isAuthenticated();
      this._isAuthenticated.set(isAuthenticated);

      if (isAuthenticated) {
        const userData = this.userRepository.getCurrentUser();
        this._user.set(userData);
        this.scheduleTokenRefresh();
      }
    } catch {
      this.logout();
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Schedule token refresh based on actual expiration time
   */
  private scheduleTokenRefresh(): void {
    const accessToken = this.tokenRepository.getToken();
    if (!accessToken) {
      return;
    }

    try {
      const decodedToken = this.decodeToken(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decodedToken.exp - currentTime;

      // Refresh 5 minutes before expiry (300 seconds)
      const refreshTime = Math.max((timeUntilExpiry - 300) * 1000, 1000);

      // Clear any existing timeout
      if (this.refreshTokenTimeout) {
        clearTimeout(this.refreshTokenTimeout);
      }

      this.ngZone.runOutsideAngular(() => {
        this.refreshTokenTimeout = window.setTimeout(() => {
          this.ngZone.run(() => {
            // Check if refresh is still needed before executing
            if (this.tokenRepository.needsRefresh()) {
              this.refreshToken().subscribe();
            }
          });
        }, refreshTime);
      });
    } catch {
      // Silent fail - token might be invalid
    }
  }

  /**
   * Stop token refresh timer
   */
  private stopTokenRefreshTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = undefined;
    }
  }

  /**
   * Refresh authentication tokens
   */
  refreshToken(): Observable<AuthTokens | null> {
    // Return existing refresh request if one is in progress
    if (this.refreshInProgress$) {
      return this.refreshInProgress$;
    }

    const userData = this.userRepository.getCurrentUser();
    const refreshToken = this.tokenRepository.getRefreshToken();

    if (!userData?.email || !refreshToken) {
      this.logout();
      return of(null);
    }

    this.refreshInProgress$ = this.authRepository
      .refreshToken({
        email: userData.email,
        refreshToken,
      })
      .pipe(
        tap(tokens => {
          this.setAuthenticated(tokens);
        }),
        catchError(() => {
          this.logout();
          return of(null);
        }),
        tap({
          complete: () => {
            this.refreshInProgress$ = undefined;
          },
          error: () => {
            this.refreshInProgress$ = undefined;
          },
        }),
      );

    return this.refreshInProgress$;
  }

  /**
   * Set authentication state after successful login
   */
  setAuthenticated(tokens: AuthTokens, rememberMe = false): void {
    this.tokenRepository.saveTokens(tokens, rememberMe);
    this._isAuthenticated.set(true);
    const userData = this.userRepository.getCurrentUser();
    this._user.set(userData);
    this.scheduleTokenRefresh();
  }

  /**
   * Logout user and clear all authentication data
   */
  logout(): void {
    const user = this._user();
    if (user) {
      // Call server-side logout first
      this.authRepository.logout(user.email, '').subscribe({
        next: () => {
          // Server logout successful, clear client-side data
          this.performClientLogout();
        },
        error: () => {
          // Server logout failed, still clear client-side data for security
          this.performClientLogout();
        },
      });
    } else {
      // No user data, just clear client-side data
      this.performClientLogout();
    }
  }

  /**
   * Perform client-side logout operations
   */
  private performClientLogout(): void {
    this.stopTokenRefreshTimer();
    this.tokenRepository.clearTokens();
    this._isAuthenticated.set(false);
    this._user.set(null);

    // Navigate to login page
    this.router.navigate(['/auth']);
  }

  /**
   * Check if user is authenticated
   */
  checkAuthentication(): boolean {
    const isAuthenticated = this.tokenRepository.isAuthenticated();
    this._isAuthenticated.set(isAuthenticated);

    if (!isAuthenticated) {
      this.logout();
    }

    return isAuthenticated;
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
          })
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error('Invalid token format');
    }
  }

  /**
   * Cleanup on store destruction
   */
  ngOnDestroy(): void {
    this.stopTokenRefreshTimer();
  }
}
