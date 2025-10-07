// src/lib/application/use-cases/refresh-token.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { BaseUseCase } from '@acontplus/ng-infrastructure';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { TokenRepository } from '../../repositories/token.repository';
import { AuthTokens } from '@acontplus/core';
import { AuthStore } from '../../ui/stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenUseCase extends BaseUseCase<void, AuthTokens> {
  private readonly authRepository = inject(AuthRepository);
  private readonly tokenRepository = inject(TokenRepository);
  private readonly authStore = inject(AuthStore);

  execute(): Observable<AuthTokens> {
    const userData = this.tokenRepository.getUserData();
    const refreshToken = this.tokenRepository.getRefreshToken();

    if (!userData?.email || !refreshToken || refreshToken.trim().length === 0) {
      const error = new Error('No refresh token or email available');
      return throwError(() => error);
    }

    return this.authRepository
      .refreshToken({
        email: userData.email,
        refreshToken,
      })
      .pipe(
        tap(tokens => {
          // Preserve the rememberMe preference from the current token storage
          const rememberMe = this.tokenRepository.isRememberMeEnabled();
          // Update authentication state
          this.authStore.setAuthenticated(tokens, rememberMe);
        }),
        catchError(error => {
          // Don't logout here, let the interceptor handle it
          return throwError(() => error);
        }),
      );
  }
}
