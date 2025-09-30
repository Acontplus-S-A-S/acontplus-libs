// src/lib/application/use-cases/login.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginRequest } from '../../domain/models/user';
import { AuthTokens } from '@acontplus/core';
import { AuthStore } from '../../ui/stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  execute(request: LoginRequest): Observable<AuthTokens> {
    return this.authRepository.login(request).pipe(
      tap(tokens => {
        // Set authentication state
        this.authStore.setAuthenticated(tokens);

        // Navigate to main page
        this.router.navigate(['/']);
      }),
    );
  }
}
