// src/lib/application/use-cases/refresh-token.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { UserRepository } from '@acontplus/ng-infrastructure';
import { TokenRepository } from '../../repositories/token.repository';
import { AuthTokens } from '@acontplus/core';
import { AuthStore } from '../../ui/stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenUseCase {
  private readonly authRepository = inject(AuthRepository);
  private readonly userRepository = inject(UserRepository);
  private readonly tokenRepository = inject(TokenRepository);
  private readonly authStore = inject(AuthStore);

  execute(): Observable<AuthTokens> {
    const userData = this.userRepository.getCurrentUser();
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
          // Update authentication state
          this.authStore.setAuthenticated(tokens);
        }),
        catchError(error => {
          // Don't logout here, let the interceptor handle it
          return throwError(() => error);
        }),
      );
  }
}
