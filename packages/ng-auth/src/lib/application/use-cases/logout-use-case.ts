// src/lib/application/use-cases/logout-use-case.ts
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { BaseUseCase } from '@acontplus/ng-infrastructure';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { AuthTokenRepositoryImpl } from '../../repositories/auth-token-repository-impl';
import { AuthStore } from '../../ui/stores/auth-store';

@Injectable({
  providedIn: 'root',
})
export class LogoutUseCase extends BaseUseCase<void, void> {
  private readonly authRepository = inject(AuthRepository);
  private readonly tokenRepository = inject(AuthTokenRepositoryImpl);
  private readonly authStore = inject(AuthStore);

  execute(): Observable<void> {
    const userData = this.tokenRepository.getUserData();
    const refreshToken = this.tokenRepository.getRefreshToken();

    if (userData?.email && refreshToken && refreshToken.length > 0) {
      return this.authRepository
        .logout(userData.email, refreshToken)
        .pipe(tap(() => this.cleanup()));
    }

    this.cleanup();
    return of(void 0);
  }

  private cleanup(): void {
    // Use auth store for centralized logout
    this.authStore.logout();
  }
}
